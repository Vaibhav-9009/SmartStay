const Property = require("../models/Property");

/**
 * @desc    Create property
 * @route   POST /api/properties
 * @access  Private
 */
exports.createProperty = async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      owner: req.user.id,
    });

    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create property",
      error: error.message,
    });
  }
};

/**
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private
 */
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // ownership check
    if (!property.owner || property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update property",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private
 */
//exports.deleteProperty = async (req, res) => {
 // try {
   // const property = await Property.findById(req.params.id);

    //if (!property) {
      //return res.status(404).json({ message: "Property not found" });
 //   }
//
  //  // ownership check
    //if (!property.owner || property.owner.toString() !== req.user.id) {
     // return res.status(403).json({ message: "Not authorized" });
    //}

    //await property.deleteOne();

   // res.status(200).json({ message: "Property deleted successfully" });
  //} catch (error) {
    //res.status(500).json({
     // message: "Failed to delete property",
      //error: error.message,
    //});
  //}
//};

/**
 * @desc    Get logged-in user's properties
 * @route   GET /api/properties/my
 * @access  Private
 */
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your properties",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all properties
 * @route   GET /api/properties
 * @access  Public
 */
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

/**
 * @desc    Search properties
 * @route   GET /api/properties/search
 * @access  Public
 */
exports.searchProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, amenities } = req.query;

    let query = {};

    if (city) query.city = city.toLowerCase();

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (amenities) {
      query.amenities = { $all: amenities.split(",") };
    }

    const results = await Property.find(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 🔍 ADD THESE TWO LINES HERE
    console.log("Owner:", property.owner);
    console.log("User:", req.user.id);

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await property.deleteOne();

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete property",
      error: error.message,
    });
  }
};

