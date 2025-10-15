import Resource from '../models/Resource.js';
import path from 'path';
import fs from 'fs';

export const uploadResource = async (req, res, next) => {
  try {
    const { title, category, semester } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const resource = await Resource.create({
      title,
      category,
      semester: semester ? parseInt(semester) : null,
      fileName: req.file.filename,
      filePath: req.file.path
    });

    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const getResources = async (req, res, next) => {
  try {
    const { category, semester, search } = req.query;

    let query = {};

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (semester) {
      query.semester = parseInt(semester);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

export const downloadResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const filePath = path.resolve(resource.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File does not exist on server'
      });
    }

    res.download(filePath, resource.fileName);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (fs.existsSync(resource.filePath)) {
      fs.unlinkSync(resource.filePath);
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
