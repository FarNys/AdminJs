const advancedResults =
  (modelName, excludeVar, populate) => async (req, res, next) => {
    let query;

    //CREATE A CLONE FROM SENT QUERY
    const reqQuery = { ...req.query };

    //WE CAN DEFINE EXCLUDE LIST TO PREVENT IT FROM SEARCHING!
    let excludeList = [...excludeVar];
    excludeList.forEach((el) => delete reqQuery[el]);

    //RE BUILD SENT QUERY FOR CHANGING gte & ... to $gte & ...
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    //CHANGE BACK TO DEFAULT JSON FILE
    query = modelName.find(JSON.parse(queryStr));

    //CHECK IF THERE IS A (SELECTED} FIELD TO SHOW
    // THEN ADD SELECT METHOD TO JUST RETURN THAT FIELD
    if (req.query.selected) {
      const fields = req.query.selected.split(",").join(" ");
      query = query.select(fields);
    }

    //ADD SORT IF EXIST
    if (req.query.sort) {
      const fields = req.query.sort.split(",").join(" ");
      query = query.sort(fields);
    }

    //ADD PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 4;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await modelName.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //ADD POPULATION AFTER DECLARE PAGINATION
    if (populate.length > 0) {
      populate.forEach((el) => query.populate(el));
      // query = query.populate(populate);
    }

    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        nextPage: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        prevPage: page - 1,
        limit,
      };
    }

    data = await query;

    res.advancedResults = {
      status: "success",
      total,
      dataLength: data.length,
      pagination,
      data,
    };
    next();
  };

module.exports = advancedResults;
