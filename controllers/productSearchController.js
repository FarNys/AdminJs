const Product = require("./../models/product");

exports.getSearchedProduct = async (req, res) => {
  const filtering = ["price", "rating"];
  //MAKE 2 CLONES FOR HANDLET INCLUDE FILTERING
  const queries = { ...req.query };
  const queries_2 = { ...req.query };
  //REMOVE! KET FROM CLONE ONE OBJECT THAT CONTAIN FILTERING ITEMS
  filtering.forEach((el) => delete queries[el]);

  //COMPARE FULL CLONE WITH FILTERED ONE AND RETURN ITEMS THAT ISNT IN SECOND CLONE(AFTER FILTERED)
  for (const property in queries_2) {
    if (queries[property]) {
      delete queries_2[property];
    }
  }

  try {
    const items = await Product.find(queries_2);
    console.log(items);
    if (items.length > 0) {
      res.status(200).json({ data: items, msg: "successfull request" });
    }
    res.status(202).json({ data: "", msg: "There is No Data" });
  } catch (error) {
    res.status(500).json({ msg: "Server has problem!" });
  }
};
