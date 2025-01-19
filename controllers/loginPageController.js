import User from "../models/user.js";

export const loginPage = async (req, res) => {
  res.render("loginPage/login", {
    layout: "loginPage/mainLogin",
    title: "Login Page",
    method: "Register",
    href: "/auth/register",
  });
};

export const registerPage = async (req, res) => {
  res.render("loginPage/register", {
    layout: "loginPage/mainLogin",
    title: "Register",
    method: "Sign In",
    href: "/auth/login",
  });
};

export const registerData = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["email", "phoneNumber"],
    });

    const registeredPhones = users.map((user) => user.phoneNumber);
    const registeredEmails = users.map((user) => user.email);

    res.json({
      registeredPhones,
      registeredEmails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
