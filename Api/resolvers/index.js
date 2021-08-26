const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { v4: uuid } = require("uuid");
const { extname } = require("path");

var Secret_Key = "sk_test_1tFKlogZlFp6mZr1AboYlL7i00jMVGem5g";

const stripe = require("stripe")(Secret_Key);

const User = require("../models/user");
const Resturant = require("../models/resturant");
const Food = require("../models/food");
const Order = require("../models/order");
const Subscription = require("../models/subscription");
const Chef = require("../models/chef");

const { resturantFoods, resturantChefs } = require("./merge");

const AWS = require("aws-sdk");

const s3 = require("../s3");
module.exports = {
  Query: {
    signIn: async (args, req) => {
      try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
          return {
            success: false,
            error_message: "Invalid account credentials!",
          };
        }
        if (!user.password) {
          return {
            success: false,
            error_message: "Invalid account credentials!",
          };
        }
        const match = await bcrypt.compare(req.password, user.password);

        if (!match) {
          return {
            success: false,
            error_message: "Password doesn't match.",
          };
        }

        if (!user.isActive) {
          return {
            success: false,
            error_message: "Invalid account credentials!",
          };
        }
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_KEY,
          {
            expiresIn: "365d",
          }
        );
        return {
          success: true,
          userId: user.id,
          token,
        };
      } catch (error) {
        throw error;
      }
    },
    user: async (args, req) => {
      try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
          return {
            success: false,
            error_message: "User not found",
          };
        }
        return {
          success: true,
          userId: user._id,
        };
      } catch (error) {
        throw error;
      }
    },

    fetchUser: async (args, req) => {
      try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.userId);
        return {
          ...user._doc,
          password: null,
        };
      } catch (error) {
        throw error;
      }
    },
    userPendingOrders: async (args, req) => {
      try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
          throw new Error("User not found");
        }
        const orders = await Order.find({ user: user._id, pending: true });
        return orders.map((order) => {
          return {
            ...order._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    userConfirmedOrders: async (args, req) => {
      try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
          throw new Error("User not found");
        }
        const orders = await Order.find({ user: user._id, accepted: true });
        return orders.map((order) => {
          return {
            ...order._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    userPickedOrders: async (args, req) => {
      try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
          throw new Error("User not found");
        }
        const orders = await Order.find({ user: user._id, picked: true });
        return orders.map((order) => {
          return {
            ...order._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },

    //Resturant
    merchantLogin: async (args, req) => {
      try {
        const resturant = await Resturant.findOne({ email: req.email });
        if (!resturant) {
          return {
            success: false,
            error_message: "Wrong Credentials",
          };
        }
        const match = await bcrypt.compare(req.password, resturant.password);
        if (!match) {
          return {
            success: false,
            error_message: "Password doesn't match.",
          };
        }
        const token = jwt.sign(
          { resturantId: resturant.id, email: resturant.email },
          process.env.SECRET_KEY,
          {
            expiresIn: "365d",
          }
        );
        return {
          token,
          success: true,
          resturantId: resturant._id,
        };
      } catch (error) {
        throw error;
      }
    },
    
    merchant: async (args, req) => {
      try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
        const resturant = await Resturant.findById(decodedToken.resturantId);
        if (!resturant) {
          return {
            success: false,
            error_message: "Resturant not found",
          };
        }
        return {
          success: true,
          resturantId: resturant._id,
        };
      } catch (error) {
        throw error;
      }
    },
    resturant: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.resturantId);
        return {
          ...resturant._doc,
          fetchFoods: resturantFoods.bind(this, resturant.foods),
          fetchChefs: resturantChefs.bind(this, resturant.chefs),
        };
      } catch (error) {
        throw error;
      }
    },
    
    nearbyResturant: async (args, req) => {
      console.log('req.location', req.location)
      try {
        const resturant = await Resturant.find({"location.coordinates": {$geoWithin: {$centerSphere: [[req.location.coordinates[0], req.location.coordinates[1]], 1/6378.15]}}});
        console.log('resturant', resturant)
        if (!resturant) {
          throw new Error("Resturant not found");
        }
        return{
          ...resturant,
        }
      } catch (error) {
        throw error;
      }
    },

    pendingResturants: async (args, req) => {
      try {
        const resturants = await Resturant.find({ admin_issued: false }).sort({
          member_since: -1,
        });
        return resturants.map((resturant) => {
          return {
            ...resturant._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    activeResturants: async (args, req) => {
      try {
        const resturants = await Resturant.find({
          on_board: true,
          banned: false,
        });
        return resturants.map((resturant) => {
          return {
            ...resturant._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    bannedResturants: async (args, req) => {
      const resturants = await Resturant.find({ banned: true });
      console.log(resturants);
      return resturants.map((resturant) => {
        return {
          ...resturant._doc,
        };
      });
    },

    //order
    resturantPendingOrders: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.resturantId);
        const orders = await Order.find({
          resturant: resturant._id,
          pending: true,
        });
        return orders.map((order) => {
          return {
            ...order._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    resturantConfirmedOrders: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.resturantId);
        const orders = await Order.find({
          resturant: resturant._id,
          accepted: true,
        });
        return orders.map((order) => {
          return {
            ...order._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    resturantPickedOrders: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.resturantId);
        const orders = await Order.find({
          resturant: resturant._id,
          picked: true,
        });
        return orders.map((order) => {
          return {
            ...order._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    order: async (args, req) => {
      try {
        const order = await Order.findById(req.orderId);
        if (!order) {
          throw new Error("Order not found");
        }
        return {
          ...order._doc,
        };
      } catch (error) {
        throw error;
      }
    },

    //search
    search: async (args, req) => {
      try {
        if (req.type) {
          const resturants = await Resturant.find({
            post_code: req.postCode,
            on_board: true,
            foodType: req.type,
          });
          return resturants.map((resturant) => {
            return {
              ...resturant._doc,
            };
          });
        } else {
          const resturants = await Resturant.find({
            post_code: req.postCode,
            on_board: true,
          });
          return resturants.map((resturant) => {
            return {
              ...resturant._doc,
            };
          });
        }
      } catch (error) {
        throw error;
      }
    },
    allUsers: async (args, req) => {
      try {
        const users = await User.find({ banned: false });
        return users.map((user) => {
          return {
            ...user._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    blockUsers: async (args, req) => {
      try {
        const users = await User.find({ banned: true });
        return users.map((user) => {
          return {
            ...user._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },

    adminLogin: async (args, req) => {
      try {
        if (process.env.ADMIN_SECRET === req.secretKey) {
          return {
            success: true,
          };
        } else {
          return {
            error_message: "Invalid secret key",
            success: false,
          };
        }
      } catch (error) {
        throw error;
      }
    },

    nearbyResturant: async (args, req) => {
      try {
        const resturant = await Resturant.find({ "location.coordinates": { $geoWithin: { $centerSphere: [[req.location.coordinates[0], req.location.coordinates[1]], 1 / 6378.15] } } });
        if (!resturant) {
          throw new Error("Resturant not found");
        }
        return resturant
      } catch (error) {
        throw error;
      }
    },
  },

  Mutation: {
    // User
    signUp: async (args, req) => {
      try {
        isEmail = validator.isEmail(req.email);
        if (!isEmail) {
          return {
            success: false,
            error_message: "Email is not valid.",
          };
        }
        const existingUser = await User.findOne({ email: req.email });
        if (existingUser) {
          return {
            success: false,
            error_message: "Email already exists, Try another one.",
          };
        }
        const hashPass = await bcrypt.hash(req.password, 10);
        const role = ["USER"];
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.email,
          password: hashPass,
          role,
          firstName: req.firstName,
          lastName: req.lastName,
          phone: req.phone,
        });
        await user.save();
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_KEY,
          {
            expiresIn: "365d",
          }
        );

        return {
          success: true,
          userId: user._id,
          token,
        };
      } catch (error) {
        throw error;
      }
    },
    googleSignIn: async (args, req) => {
      try {
        const user = await User.findOne({ email: req.email });
        if (user) {
          const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.SECRET_KEY,
            {
              expiresIn: "365d",
            }
          );
          return {
            success: true,
            userId: user.id,
            token,
          };
        }
        const new_user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.email,
          userName: req.userName,
        });

        await new_user.save();
        const token = jwt.sign(
          { userId: new_user.id, email: req.email },
          process.env.SECRET_KEY,
          {
            expiresIn: "365d",
          }
        );
        return {
          success: true,
          userId: new_user.id,
          token,
        };
      } catch (error) {
        throw error;
      }
    },
    userPasswordChange: async (args, req) => {
      try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.userId);

        const match = await bcrypt.compare(req.oldPassword, user.password);
        if (!match) {
          return {
            success: false,
            error_message: "Old password wrong!",
          };
        }
        const same = await bcrypt.compare(req.newPassword, user.password);
        if (same) {
          return {
            success: false,
            error_message: "Try different password!",
          };
        }
        const hashPass = await bcrypt.hash(req.newPassword, 10);
        await user.updateOne({
          password: hashPass,
        });
        return {
          success: true,
        };
      } catch (error) {
        throw error;
      }
    },
    deactivateAccount: async (args, req) => {
      try {
        const user = await User.findById(req.userId);

        const match = await bcrypt.compare(req.password, user.password);
        if (!match) {
          return {
            success: false,
            error_message: "Icorrect Password!",
          };
        }
        await user.updateOne({
          isActive: false,
        });
        return {
          success: true,
        };
      } catch (error) {
        throw error;
      }
    },
    forgotPassword: async (args, req) => {
      try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
          return {
            success: false,
            error_message:
              "No result found. please try again with other information.",
            resetCode: null,
          };
        }
        const resetCode = Math.floor(Math.random() * 899999 + 100000);
        await user.updateOne({
          resetCode,
        });
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "bazmin217@gmail.com", // Your email id
            pass: "Bangla1@MominLija1#", // Your password
          },
          //   service: 'gmail',
          //   auth: {
          //     user: 'bazmin217@gmail.com', // generated ethereal user
          //     pass: 'kenoemon1@', // generated ethereal password
          //   },
        });
        console.log("transporter", transporter);

        // send mail with defined transport object

        let info = await transporter.sendMail({
          from: "mominprofession@gmail.com", // sender address
          to: req.email, // list of receivers
          subject: `Authentication code ${resetCode}`, // Subject line
          text: "resetCode", // plain text body
          html: `<div style={background:"red"}> <h1>BookTheChefs</h1><p>Your authentication code is ${resetCode}</p></div>`,
        });
        console.log("Info", info);
        return {
          success: true,
          email: req.email,
          resetCode: null,
        };
      } catch (error) {
        throw error;
      }
    },
    authorizeResetPassword: async (args, req) => {
      try {
        const user = await User.findOne({ email: req.email });
        if (user.resetCode !== req.resetCode) {
          return {
            success: false,
            resetCode: null,
            error_message: "Authorization code wrong.",
          };
        }
        await user.updateOne({
          passwordReset: true,
        });
        return {
          success: true,
          resetCode: null,
        };
      } catch (error) {
        throw error;
      }
    },
    resetPassword: async (args, req) => {
      try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
          throw new Error("User not found!");
        }
        if (!user.passwordReset) {
          throw new Error("Something went wrong!");
        }
        const hashPass = await bcrypt.hash(req.newPassword, 10);
        await user.updateOne({
          password: hashPass,
          passwordReset: false,
          resetCode: null,
        });
        return {
          success: true,
        };
      } catch (error) {
        throw error;
      }
    },
    //Resturant
    resturantRequest: async (args, req) => {
      const hashPass = await bcrypt.hash(req.password, 10);

      const business_hour = {
        open: "10:00",
        close: "22:00",
      };
      try {
        const resturant = new Resturant({
          _id: new mongoose.Types.ObjectId(),
          name: req.name,
          email: req.email,
          post_code: req.post_code,
          password: hashPass,
          contact_number: req.contact_number,
          member_since: new Date().toISOString(),
          business_hour,
          foodType: req.foodType,
          location: req.location
        });
        // console.log(resturant);
        await resturant.save();
        console.log('resturant save', resturant._doc)
        return {
          ...resturant._doc,
        };
      } catch (error) {
        throw error;
      }
    },
    onBoardResturant: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.resturantId);
        if (!resturant) {
          throw new Error("Resturant not found");
        }
        await resturant.updateOne({
          on_board: true,
          admin_issued: true,
        });
        const allPendings = await Resturant.find({ admin_issued: false });
        return allPendings.map((returant) => {
          return {
            ...resturant._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    cancelResturantRequest: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.resturantId);
        if (!resturant) {
          throw new Error("Resturant not found");
        }
        await resturant.updateOne({
          admin_issued: true,
        });
        return {
          ...resturant._doc,
        };
      } catch (error) {
        throw error;
      }
    },
    bannedResturant: async (args, req) => {
      const resturant = await Resturant.findById(req.resturantId);
      await resturant.updateOne({
        banned: true,
      });
      return {
        ...resturant._doc,
      };
    },
    activateBannedResturant: async (args, req) => {
      const resturant = await Resturant.findById(req.resturantId);
      await resturant.updateOne({
        banned: false,
      });
      return {
        ...resturant._doc,
      };
    },
    updateResturant: async (args, req) => {
      const resturant = await Resturant.findById(req.merchantId);
      const business_hour = {
        open: req.openHour,
        close: req.closeHour,
      };
      await resturant.updateOne({
        name: req.name,
        intro: req.intro,
        business_hour,
        bank_account: req.bank_account,
        cover_image: req.coverImage,
      });
      const updatedResturant = await Resturant.findById(req.merchantId);
      return {
        ...updatedResturant._doc,
      };
    },
    merchantPasswordChange: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.merchantId);
        if (!resturant) {
          throw new Error("Resturant not found!");
        }
        const match = await bcrypt.compare(req.oldPassword, resturant.password);
        if (!match) {
          return {
            success: false,
            error_message: "Old password wrong!",
          };
        }
        const same = await bcrypt.compare(req.newPassword, resturant.password);
        if (same) {
          return {
            success: false,
            error_message: "Provide different password!.",
          };
        }
        const hashPass = await bcrypt.hash(req.newPassword, 10);
        await resturant.updateOne({
          password: hashPass,
        });
        return {
          success: true,
        };
      } catch (error) {
        throw error;
      }
    },
    merchantForgotPassword: async (args, req) => {
      try {
        const merchant = await Resturant.findOne({ email: req.email });
        if (!merchant) {
          return {
            success: false,
            error_message:
              "No result found. please try again with other information.",
            resetCode: null,
          };
        }
        const resetCode = Math.floor(Math.random() * 899999 + 100000);
        await merchant.updateOne({
          resetCode,
        });
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "bazmin217@gmail.com", // generated ethereal user
            pass: "kenoemon1@", // generated ethereal password
          },
        });

        // send mail with defined transport object

        let info = await transporter.sendMail({
          from: "bazmin217@gmail.com", // sender address
          to: req.email, // list of receivers
          subject: `Authentication code ${resetCode}`, // Subject line
          text: "resetCode", // plain text body
          html: `<div style={background:"red"}>
              <h1>BookTheChefs</h1>
             <p>Your authentication code is ${resetCode}</p>
                <a href="http://localhost:3000/">bookthechefs<a/>
            </div>`,
        });

        return {
          success: true,
          email: req.email,
          resetCode: null,
        };
      } catch (error) {
        throw error;
      }
    },
    authorizeMerchantResetPassword: async (args, req) => {
      try {
        const merchant = await Resturant.findOne({ email: req.email });
        if (merchant.resetCode !== req.resetCode) {
          return {
            success: false,
            resetCode: null,
            error_message: "Authorization code wrong.",
          };
        }
        await merchant.updateOne({
          passwordReset: true,
        });
        return {
          success: true,
          resetCode: null,
        };
      } catch (error) {
        throw error;
      }
    },
    addChef: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.id);
        if (!resturant) {
          throw new Error('Restaurant not found');
        }
        // console.log(req);
        // return
        const chef = new Chef({
          _id: new mongoose.Types.ObjectId(),
          chefName: req.chefName,
          chefBio: req.chefBio,
          chefImage: req.chefImage,
          addedAt: new Date().toISOString(),
        });
        console.log(chef);
        await chef.save();

        resturant.chefs.push(chef._id);
        await resturant.save();

        const chefs = await Chef.find({ _id: { $in: resturant.chefs } }).sort({
          addedtAt: -1,
        });

        return chefs.map((chef) => {
          return {
            ...chef._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    merchantResetPassword: async (args, req) => {
      try {
        const merchant = await Resturant.findOne({ email: req.email });
        if (!merchant) {
          throw new Error("Merchant not found!");
        }
        if (!merchant.passwordReset) {
          throw new Error("Something went wrong!");
        }
        const hashPass = await bcrypt.hash(req.newPassword, 10);
        await merchant.updateOne({
          password: hashPass,
          passwordReset: false,
          resetCode: null,
        });
        return {
          success: true,
        };
      } catch (error) {
        throw error;
      }
    },
    //Food
    addFood: async (args, req) => {
      try {
        const resturant = await Resturant.findById(req.foodInput.resturant);
        if (!resturant) {
          throw new Error("Resturant not found");
        }
        let offer = 0;
        if (req.foodInput.offer) {
          offer = req.foodInput.offer;
        }
        console.log(offer);
        const food = new Food({
          _id: new mongoose.Types.ObjectId(),
          name: req.foodInput.name,
          description: req.foodInput.description,
          price: req.foodInput.price,
          offer,
          images: req.foodInput.images,
          resturant: req.foodInput.resturant,
          addedAt: new Date().toISOString(),
        });
        console.log(food);
        await food.save();

        resturant.foods.push(food._id);
        await resturant.save();

        const foods = await Food.find({ _id: { $in: resturant.foods } }).sort({
          addedtAt: -1,
        });

        return foods.map((food) => {
          return {
            ...food._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    updateFood: async (args, req) => {
      try {
        const food = await Food.findById(req.foodInput.foodId);
        console.log(food);
        if (!food) {
          throw new Error("Food not found");
        }
        let offer = 0;
        if (req.foodInput.offer) {
          offer = req.foodInput.offer;
        }
        await food.updateOne({
          name: req.foodInput.name,
          description: req.foodInput.description,
          price: req.foodInput.price,
          offer,
          images: req.foodInput.images,
        });
        const resturant = await Resturant.findOne({ _id: food.resturant });
        const foods = await Food.find({ _id: { $in: resturant.foods } });
        return foods.map((food) => {
          return {
            ...food._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    deleteFood: async (args, req) => {
      try {
        const food = await Food.findByIdAndDelete(req.foodId);
        const resturant = await Resturant.findById(food.resturant);
        resturant.foods.pull(food._id);
        await resturant.save();
        return {
          ...food._doc,
        };
      } catch (error) {
        throw error;
      }
    },

    //Order
    createOrder: async (args, req) => {
      try {
        console.log("I am here");
        const resturant = await Resturant.findById(req.orderInput.resturant);
        const user = await User.findById(req.orderInput.user);
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          resturant: req.orderInput.resturant,
          user: req.orderInput.user,
          sub_total: req.orderInput.sub_total,
          total: req.orderInput.total,
          pickup_time: req.orderInput.pickup_time,
          contact_number: req.orderInput.contact_number,
          foods: req.orderInput.foods,
        });
        await order.save();
        console.log(order);
        resturant.pending_orders.push(order._id);
        await resturant.save();

        user.orders.push(order._id);
        await user.save();

        return {
          ...order._doc,
        };
      } catch (error) {
        throw error;
      }
    },

    acceptOrder: async (args, req) => {
      try {
        const order = await Order.findById(req.orderId);
        if (!order) {
          throw new Error("Order not found");
        }
        await order.updateOne({
          pending: false,
          accepted: true,
        });
        const resturant = await Resturant.findById(order.resturant);
        resturant.pending_orders.pull(order._id);
        resturant.confirmed_orders.push(order._id);
        await resturant.save();

        const orders = await Order.find({
          resturant: resturant._id,
          pending: true,
        });
        return orders.map((order) => {
          return {
            ...order._doc,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    pickedOrder: async (args, req) => {
      try {
        const order = await Order.findById(req.orderId);
        if (!order) {
          throw new Error("Order not found");
        }
        await order.updateOne({
          accepted: false,
          picked: true,
        });
        order.foods.map(async (food) => {
          const findFood = await Food.findById(food.itemId);
          await findFood.updateOne({
            sale: findFood.sale + food.quantity,
          });
        });
        return {
          ...order._doc,
        };
      } catch (error) {
        throw error;
      }
    },
    //File Upload
    uploadFile: async (parent, { file }) => {
      console.log("Hi there in Local");
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();
      const pathName = path.join(
        __dirname,
        `../../images/foodFiles/${filename}`
      );
      await stream.pipe(fs.createWriteStream(pathName));
      return {
        url: `${process.env.URL}/foodFiles/${filename}`,
      };
    },
    //uploadCover
    uploadCover: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const name = filename + new Date().toISOString();
      const stream = createReadStream();
      const pathName = path.join(
        __dirname,
        `../../images/coverFiles/${filename}`
      );
      await stream.pipe(fs.createWriteStream(pathName));
      return {
        url: `${process.env.URL}/coverFiles/${filename}`,
      };
    },
    uploadToAws: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const { Location } = await s3
        .upload({
          Body: createReadStream(),
          Key: `${uuid()}${extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();

      return {
        filename,
        mimetype,
        encoding,
        url: Location,
      };
    },

    //payment
    payment: async (args, req) => {
      try {
        const customer = await stripe.customers.create({
          email: req.email,
          source: req.source,
          name: req.email,
        });
        const charge = await stripe.charges.create({
          customer: customer.id,
          amount: req.amount * 100,
          currency: "gbp",
        });
        console.log(charge);
        if (charge.status == "succeeded") {
          const order = await Order.findById(req.orderId);
          await order.updateOne({
            paid: true,
            cardId: req.source,
          });
          const resturant = await Resturant.findById(order.resturant);
          await resturant.updateOne({
            total_sale: resturant.total_sale + order.total,
            current_balance: resturant.current_balance + order.total,
          });

          return {
            ...order._doc,
          };
        }
      } catch (error) {
        throw error;
      }
    },

    //admin
    payResturant: async (args, req) => {
      try {
        let invoice, new_amount;
        const resturant = await Resturant.findById(req.resturantId);
        if (!resturant) {
          throw new Error("Resturant not found");
        }
        if (req.amount > resturant.current_balance) {
          throw new Error("Balance Exceed");
        }
        invoice = {
          date: new Date().toISOString(),
          amount: req.amount,
        };
        console.log(invoice);

        new_amount = resturant.current_balance - req.amount;
        await resturant.updateOne({
          current_balance: new_amount,
          last_invoice: invoice,
        });

        return {
          ...resturant._doc,
          current_balance: new_amount,
          last_invoice: invoice,
        };
      } catch (error) {
        throw error;
      }
    },
    blockUser: async (args, req) => {
      try {
        const user = await User.findById(req.userId);
        if (!user) {
          throw new Error("User not found!");
        }
        await user.updateOne({
          banned: true,
        });
        return {
          ...user._doc,
        };
      } catch (error) {
        throw error;
      }
    },
    activateBlockUser: async (args, req) => {
      try {
        const user = await User.findById(req.userId);
        if (!user) {
          throw new Error("User not found!");
        }
        await user.updateOne({
          banned: false,
        });
        return {
          ...user._doc,
        };
      } catch (error) {
        throw error;
      }
    },
    subscribe: async (args, req) => {
      try {
        const find = await Subscription.findOne({ email: req.email });
        if (find) {
          return {
            success: false,
            error_message: "This email already subsribed!",
          };
        }

        const subscr = await new Subscription({
          _id: new mongoose.Types.ObjectId(),
          email: req.email,
        });
        await subscr.save();
        return {
          success: true,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};
