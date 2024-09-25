const User = require('../model/User')
const categorys = require('../model/category');
const subcategorys = require('../model/subCategory')
const addproduct = require('../model/Product');
const multer = require('../util/multer')
const fs = require('fs')
const mongoose = require('mongoose');

module.exports = {
      getAdmin: async (req, res, next) => {
      try {
      const checkUsers = await User.find({ role: { $ne: 'admin' } });// Fetch users from the database
      const checkProduct = await addproduct.find();
      const checkSubCategory = await subcategorys.find();
      const checkCategory = await categorys.find();
      const productCount = await addproduct.find()
      .populate('category')      // Assuming 'category' is the field referencing Category model
      .populate('SubCategory')  // Assuming 'subCategory' is the field referencing SubCategory model
      .exec()
      res.render('admin',{ checkUsers, checkProduct, checkSubCategory, checkCategory,productCount })
      console.log(productCount);

      } catch (error) {
      console.error('Error fetching users:', error);
      next(error); // Pass the error to the error-handling middleware
      }
      },
    postadmin: async (req, res) => {
    console.log(req.body);
    const { username, email, password, passwordc } = req.body;
    const userdata = await User.findOne();
    },
    getproductdetails: (req, res) => {
    res.render('product-detail')
    },
  getaddproduct: async (req, res) => {
    try {
      const category = await categorys.find()
      res.render('add-product',{category})
    } catch (error) {
      console.log(error.message);
    }

  },
  postaddproduct: async (req, res) => {
    try {
      // in database add categoryid sub categoryid
      const { productName, description, price,category,SubCategory,Stock, size, colour } = req.body;
      console.log(req.body);
      console.log("req.files",req.files);
      const picture = req.files.map(image=>image?.filename);
      console.log(picture);
      console.log(picture);
      await addproduct.create({ productName, description, price , category,SubCategory,Stock,size,colour,picture});
      res.redirect('/admin');
    } catch (error) {
      console.log(error.message);
    }
  },
  getUpdateProduct: async (req, res) => {
    try {
      const productId = req.params.id;
     const product = await addproduct.findById(productId)
            .populate('category')      // Ensure category field is populated
            .populate('SubCategory')  // Ensure subCategory field is populated
            .exec();
        // Debugging logs
        console.log("Product:", product);
        console.log("Product Stock:", product.Stock)
      const category = await categorys.find()
      const subCategory = await subcategorys.find()
      if (!product) {
        return res.status(404).send('Product not updated');
      }
      console.log("update:", product);
      res.render('UpdateProduct', {product,category,subCategory});
    } catch (error) {
      console.error('Error retrieving product:', error);
      res.status(500).send('Internal Server Error');
    }
  },
  postUpadateProduct: async (req, res) => {
    const productId = req.params.id;
    const product = await addproduct.findById(productId);
    console.log(product.category);
const { productName, description, price, Stock, size, colour, category, subcategory } = req.body;
console.log("categ",product.category);
console.log("categ",product.subcategory);

    console.log("req body",req.body);
    console.log("filess",req.files);
    // console.log("req file is:", req.files.filename);
    let picture=[];
    if(req.files&&req.files.length>0){
      picture=req.files.map(image=>image.filename)
    }else{
      const productId = req.params.id;
        const productsId= await addproduct.findById(productId);
        picture=productsId.picture
       console.log(picture);  
    }
    //update product
   

    // Prepare update data
 
        await addproduct.updateOne(
            { _id: productId },
            {
                productName,
                description,
                price,
                Stock,
                size,
                colour,
                picture,
                category,
                subcategory
            }
        );
     return res.redirect('/admin')
  },
 
  getDeleteProduct: async (req, res) => {
    try {
      console.log("jehfjhefbejh");
      const productId = req.params.id;
      console.log('deletedid:', productId);

      const deleteProduct = await addproduct.findById(productId);
      console.log(deleteProduct);

      if (!deleteProduct) {
        return res.status(404).send('Product not found');
      }
      await addproduct.findByIdAndDelete(productId);
      res.redirect('/admin')
      console.log("deleted", deleteProduct);

    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
    }
  },
  getBlockUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const Block = await User.updateOne({ _id: userId }, { $set: { block: true } });
      if (Block) {
        res.redirect("/admin")
        console.log("userblock", Block);
      }

    } catch (error) {
      console.log("error", error);
    }
  },
  getUnBlockUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const UnBlock = await User.updateOne({ _id: userId }, { $set: { block: false } });
      if (UnBlock) {
        res.redirect("/admin")
        console.log("userblock", UnBlock);
      }
    } catch (error) {
      console.log("error", error);
    }
  },

  //add category
  getaddCategory: async (req, res) => {
    try {
      const categoryschema = await categorys.find()
      console.log(categoryschema);
      // const categoryId = req.params.id;
      // const data=req.body;
      res.render('AddCategory', { categoryschema });
    } catch (error) {
      console.log(error);
    }
  },
  PostaddCategory: async (req, res) => {
    const { name } = req.body;
    console.log("post cat", req.body);
    try {
      const newCategory = new categorys({ name }); // create a new category instance
      await newCategory.save(); // save the new category to the database
      res.redirect('/admin');
    } catch (error) {
      console.log("error", error); // log the actual error message
      res.status(500).send("Server Error");
    }
  },
  // update category
  getUpdateCategory: async (req, res) => {
    console.log("kkkk");
    try {
      const categoryId = req.params.id; // Assuming the ID is passed in the URL
      const UpdateCategory = await categorys.findById(categoryId);
      console.log("cat", UpdateCategory);
      if (!UpdateCategory) {
        return res.status(404).send('category not found');
      }
      res.render('UpdateCategory', { UpdateCategory });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }

  },
  // update sub category
postUpdateCategory : async (req, res) => {
      try {
          const { name } = req.body;
          const categoryId = req.params.id;
          console.log(categoryId);
          await categorys.updateOne({ _id: categoryId }, { name });
          res.redirect('/admin');
      } catch (error) {
          console.log("error", error.message); // Log the actual error message
          res.status(500).send("Server Error");
      }
  },
  getDeleteCategory: async (req, res) => {
    console.log("i am here");
    try {
      const CategoryId = req.params.id;

      const deleteCategory = await categorys.findById(CategoryId);
      console.log("del Sub", deleteCategory);

      if (!deleteCategory) {
        return res.status(404).send('Product not found');
      }
      await categorys.findByIdAndDelete(CategoryId);
      res.redirect('/admin')
      console.log("deleted", deleteCategory);

    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  




  // add sub category
  getaddSubCategory: async (req, res) => {
    try {
      const data = req.body;
      const catedorydat = await categorys.find()
      res.render('SubCategory', { catedorydat });
    } catch (error) {
      console.log(error.message);
    }
  },
  PostaddSubCategory: async (req, res) => {

    console.log("sub", req.body);
    const { SubCategorie, CategoryId } = req.body;

    try {
      const newSubCategory = new subcategorys({ SubCategorie, CategoryId }); // create a new category instance
      await newSubCategory.save(); // save the new category to the database
      res.redirect('/admin');
    } catch (error) {
      console.log("error", error.message); // log the actual error message
      res.status(500).send("Server Error");
    }
  },
   getDeleteSubCategory: async (req, res) => {
    console.log("i am here");
    try {
      const SubCategoryId = req.params.id;

      const deleteProduct = await subcategorys.findById(SubCategoryId);
      console.log("del Sub", deleteProduct);

      if (!deleteProduct) {
        return res.status(404).send('Product not found');
      }
      await subcategorys.findByIdAndDelete(SubCategoryId);
      console.log("deleted", deleteProduct);

    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
    }
  },




  // for fetch
  //   getUpdateSubCategory : ('/UpdateSubCategory/:id',async(req,res)=>{
  //     const SubCategoryId = req.params.id
  //     console.log("SubCategory is ",SubCategoryId);
  //     const Updatesubcategory = await subcategorys.findById(SubCategoryId);
  //     res.render('./UpdateSubCategory',{Updatesubcategory})

  // }),



  // update sub category
  getUpdateSubCategory: async (req, res) => {
    try {
      const subcategoryId = req.params.id; // Assuming the ID is passed in the URL
      const Updatesubcategory = await subcategorys.findById(subcategoryId);
      if (!Updatesubcategory) {
        return res.status(404).send('Subcategory not found');
      }
      res.render('UpdateSubCategory', { Updatesubcategory });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }

  },
  postUpdateSubCategory: async (req, res) => {
    console.log("req  ", req.body);
    try {
      const { SubCategorie } = req.body;
      await subcategorys.updateOne({ SubCategorie });
      res.redirect('/admin');
    } catch (error) {
      console.log("error", error.message); // log the actual error message
      res.status(500).send("Server Error");
    }
  },
  //delete sub category
  getDeleteSubCategory: async (req, res) => {
    console.log("i am here");
    try {
      const SubCategoryId = req.params.id;

      const deleteProduct = await subcategorys.findById(SubCategoryId);
      console.log("del Sub", deleteProduct);

      if (!deleteProduct) {
        return res.status(404).send('Product not found');
      }
      await subcategorys.findByIdAndDelete(SubCategoryId);
      res.redirect('/admin')
      console.log("deleted", deleteProduct);

    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
    }
  }




}
