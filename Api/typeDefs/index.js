const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID
    email: String
    user_name: String
    banned: Boolean
    verified: Boolean
    orders: [String!]
  }
  type AuthData {
    userId: ID
    token: String
    success: Boolean
    error_message: String
    email: String
    resetCode: String
  }
  type MerchantAuth {
    resturantId: String
    token: String
    success: Boolean
    error_message: String
    email: String
    resetCode: String
  }
  type File {
    url: String
  }
  type BusinessHour {
    open: String
    close: String
  }
  input BusinessHourInput {
    open: String
    close: String
  }
  type Invoice {
    date: String
    amount: Int
  }
  type Location {
    type: String,
    coordinates: [Float]
  }

  type BankAccount {
    sortCode: Int,
    accountNumber: Int,
    accountHolderName: String,
    bankName: String,
  }

  type Chef {
    _id: ID
    chefName: String
    chefBio: String
    chefImage: String
  }

  type Resturant {
    _id: ID
    name: String
    intro: String
    post_code: String
    cover_image: String
    foods: [String!]
    foodType: String!
    fetchFoods: [Food!]
    email: String
    password: String
    orders: [String]
    pending_orders: [String]
    confirmed_odrers: [String]
    pickup_orders: [String]
    fetch_orders: [Order!]
    bank_account: BankAccount
    total_sale: Int
    current_balance: Int
    categories: [String]
    open_status: Boolean
    merchant_login_email: String
    merchant_login_password: String
    business_hour: BusinessHour
    contact_number: String
    on_board: Boolean
    admin_issued: Boolean
    member_since: String
    banned: Boolean
    verified: Boolean
    last_invoice: Invoice!
    location: Location
    chefs: [String!]
    fetchChefs: [Chef!]
  }

  type Food {
    _id: ID
    name: String
    description: String
    price: Int
    offer: Int
    sale: Int
    images: [String]
    resturant: String
  }
  input FoodInput {
    name: String
    description: String
    price: Int
    offer: Int
    resturant: String
    images: [String]
    foodId: String
  }
  type OrderedFood {
    itemId: String
    quantity: Int
    price: Int
    image: String
    title: String
    food: Food
  }
  input OrderedFoodInput {
    itemId: String
    quantity: Int
    price: Int
    image: String
    title: String
  }
  type Order {
    _id: ID
    resturant: String
    foods: [OrderedFood]
    sub_total: Int
    total: Int
    pickup_time: String
    user: String
    picked: Boolean
    pending: Boolean
    confirmed: Boolean
    paid: Boolean
    cardId: String
    contact_number: String
  }
  input OrderInput {
    resturant: String
    foods: [OrderedFoodInput]
    sub_total: Int
    total: Int
    pickup_time: String
    user: String
    contact_number: String
  }

  type Query {
    signIn(email: String, password: String): AuthData!
    user(token: String!): AuthData!
    fetchUser(token: String): User!
    userPendingOrders(token: String): [Order!]
    userConfirmedOrders(token: String): [Order!]
    userPickedOrders(token: String): [Order!]
    nearbyResturant(location: LocationInput): [Resturant!]

    resturant(resturantId: String): Resturant!
    order(orderId: String): Order!
    resturantPendingOrders(resturantId: String!): [Order!]
    resturantConfirmedOrders(resturantId: String!): [Order!]
    resturantPickedOrders(resturantId: String!): [Order!]
    merchantLogin(email: String, password: String): MerchantAuth!
    merchant(token: String): MerchantAuth!

    pendingResturants: [Resturant!]
    activeResturants: [Resturant!]
    bannedResturants: [Resturant!]

    search(postCode: String!, type: String): [Resturant!]

    allUsers: [User!]
    blockUsers: [User!]

    adminLogin(secretKey: String!): AuthData!
  }
  input LocationInput {
    type: String,
    coordinates: [Float]
  }

  input BankAccountInput {
    sortCode: Int,
    accountNumber: Int,
    accountHolderName: String,
    bankName: String,
  }

  type Mutation {
    signUp(
      email: String
      password: String
      firstName: String
      lastName: String
      phone: String
    ): AuthData!
    googleSignIn(email: String): AuthData!
    userPasswordChange(
      token: String!
      oldPassword: String!
      newPassword: String!
    ): AuthData!
    forgotPassword(email: String!): AuthData!
    authorizeResetPassword(email: String, resetCode: Int): AuthData!
    resetPassword(email: String, newPassword: String): AuthData!
    deactivateAccount(userId: String, password: String): AuthData!
    resturantRequest(
      name: String
      post_code: String
      email: String!
      contact_number: String!
      password: String!
      foodType: String
      location: LocationInput
    ): Resturant!
    
    onBoardResturant(resturantId: String!): [Resturant!]
    bannedResturant(resturantId: String!): Resturant!
    activateBannedResturant(resturantId: String!): Resturant!
    cancelResturantRequest(resturantId: String!): [Resturant!]
    updateResturant(
      merchantId: String
      name: String
      intro: String
      openHour: String
      closeHour: String
      bank_account: BankAccountInput
      coverImage: String
    ): Resturant!
    merchantPasswordChange(
      merchantId: String!
      oldPassword: String!
      newPassword: String!
    ): MerchantAuth!
    merchantForgotPassword(email: String): MerchantAuth!
    authorizeMerchantResetPassword(email: String, resetCode: Int): MerchantAuth!
    merchantResetPassword(email: String, newPassword: String): MerchantAuth!
    addChef(
      id: String
      chefName: String!
      chefBio: String
      chefImage: String
    ): [Chef!]

    addFood(foodInput: FoodInput): [Food!]
    updateFood(foodInput: FoodInput): [Food!]
    deleteFood(foodId: String): Food!

    createOrder(orderInput: OrderInput): Order!
    acceptOrder(orderId: String!): [Order!]
    pickedOrder(orderId: String!): Order!

    uploadFile(file: Upload!): File!
    uploadToAws(file: Upload!): File!
    uploadCover(file: Upload!): File!

    payment(
      source: String!
      orderId: String!
      amount: Int!
      email: String
    ): User!

    payResturant(amount: Int, resturantId: String): Resturant!

    blockUser(userId: String): User!
    activateBlockUser(userId: String!): User!

    subscribe(email: String!): AuthData!
  }
`;
