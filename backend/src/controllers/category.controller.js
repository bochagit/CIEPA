import Category from '../models/Category.js'

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ active: true }).sort({ name: 1 })
        res.json(categories)
    } catch(error) {
        console.error("Error al obtener categorías: ", error)
        res.status(500).json({ message: "Error al obtener las categorías" })
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" })
        }
        res.json(category)
    } catch(error) {
        console.error("Error al obtener categoría: ", error)
        res.status(500).json({ message: "Error al obtener la categoría" })
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ message: "El nombre es obligatorio" })
        }

        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            active: true
        })

        if (existingCategory) {
            return res.status(400).json({ message: "Ya existe una categoría con ese nombre" })
        }

        const category = new Category({
            name: name.trim()
        })

        await category.save()
        res.status(201).json(category)
    } catch(error) {
        console.error("Error al actualizar categoría: ", error)
        res.status(500).json({ message: "Error al actualizar la categoría" })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body

        if (!name || !name.trim()){
            return res.status(400).json({ message: "El nombre es obligatorio" })
        }

        const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            _id: { $ne: req.params.id },
            active: true
        })

        if (existingCategory) {
            return res.status(400).json({ message: "Ya existe una categoría con ese nombre" })
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: name.trim() },
            { new: true }
        )

        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" })
        }

        res.json(category)
    } catch(error) {
        console.error("Error al actualizar categoría: ", error)
        res.status(500).json({ message: "Error al actualizar la categoría" })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        )

        if (!category){
            return res.status(404).json({ message: "Categoría no encontrada" })
        }

        res.json({ message: "Categoría eliminada correctamente", category })
    } catch(error) {
        console.error("Error al eliminar categoría: ", error)
        res.status(500).json({ message: "Error al eliminar la categoría" })
    }
}

export const getInactiveCategories = async (req, res) => {
    try {
        const categories = await Category.find({ active: false }).sort({ name: 1 })
        res.json(categories)
    } catch(error) {
        console.error("Error al obtener categorías inactivas: ", error)
        res.status(500).json({ message: "Error al obtener las categorías inactivas" })
    }
}

export const reactivateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { active: true },
            { new: true }
        )

        if (!category){
            return res.status(404).json({ message: "Categoría no encontrada" })
        }

        res.json({ message: "Categoría reactivada correctamente", category })
    } catch(error) {
        console.error("Error al reactivar categoría: ", error)
        res.status(500).json({ message: "Error al reactivar la categoría" })
    }
}