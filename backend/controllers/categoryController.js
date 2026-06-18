const Category = require("../models/Category");

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const {
    uploadToCloudinary,
} = require("../services/cloudinaryService");


const createCategory = async (
    req,
    res,
    next
) => {
    try {
        const { name } = req.body;

        const existingCategory =
            await Category.findOne({ name });

        if (existingCategory) {
            throw new ApiError(
                400,
                "Category already exists"
            );
        }

        let icon = "";

        if (req.file) {
            const result =
                await uploadToCloudinary(
                    req.file,
                    "campuspass/categories"
                );

            icon = result.secure_url;
        }

        const category =
            await Category.create({
                name,
                icon,
            });

        res.status(201).json(
            new ApiResponse(
                201,
                "Category created successfully",
                category
            )
        );
    } catch (error) {
        next(error);
    }
};



const updateCategory = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category =
            await Category.findById(id);

        if (!category) {
            throw new ApiError(
                404,
                "Category not found"
            );
        }

        if (name) {
            category.name = name;
        }

        if (req.file) {
            const result =
                await uploadToCloudinary(
                    req.file,
                    "campuspass/categories"
                );

            category.icon =
                result.secure_url;
        }

        await category.save();

        res.status(200).json(
            new ApiResponse(
                200,
                "Category updated successfully",
                category
            )
        );
    } catch (error) {
        next(error);
    }
};


const deleteCategory = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        const category =
            await Category.findById(id);

        if (!category) {
            throw new ApiError(
                404,
                "Category not found"
            );
        }

        await Category.findByIdAndDelete(
            id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Category deleted successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};



const getAllCategories =
    async (
        req,
        res,
        next
    ) => {
        try {
            const categories =
                await Category.find().sort({
                    createdAt: -1,
                });

            res.status(200).json(
                new ApiResponse(
                    200,
                    "Categories fetched successfully",
                    categories
                )
            );
        } catch (error) {
            next(error);
        }
    };



const getCategoryById =
    async (
        req,
        res,
        next
    ) => {
        try {
            const category =
                await Category.findById(
                    req.params.id
                );

            if (!category) {
                throw new ApiError(
                    404,
                    "Category not found"
                );
            }

            res.status(200).json(
                new ApiResponse(
                    200,
                    "Category fetched successfully",
                    category
                )
            );
        } catch (error) {
            next(error);
        }
    };

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
};