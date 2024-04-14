// This file has functions that interact with User.

import bcrypt from "bcrypt"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"
import User from "../models/userModel";
import { IUser } from "../types/userTypes";

const getUserToken = (_id: string | Types.ObjectId) => {
  const authenticatedUserToken = jwt.sign({ _id }, "express", {
    expiresIn: "7d",
  })
  return authenticatedUserToken
}

// API to handle creating user. Takes Name, Email, UID (Provided by Firebase API via Frontend), and Password then stores it in MONGODB

export const createUser = async (request: Request, response: Response) => {
  try {
    const { name, email, uid, password } = request.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return response.status(409).send("user already exist")
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await User.create({
      name: name,
      email: email,
      uid: uid,
      password: hashedPassword,
    })

    return response.status(201).send({ message: "User created successfully" })
  } catch (error) {
    console.log("error in createUser", error)
    throw error
  }
}

// API to handle logging in User
export const loginUser = async (request: Request, response: Response) => {
  try {
    const { email, password }: IUser = request.body
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return response.status(409).send({ message: "User doesn't exist" })
    }
    const isPasswordIdentical = await bcrypt.compare(
      password,
      existingUser.password
    )
    if (isPasswordIdentical) {
      const token = getUserToken(existingUser._id)
      return response.send({
        token,
        user: {
          email: existingUser.email,
          name: existingUser.name,
        },
      })
    } else {
      return response.status(400).send({ message: "Wrong credentials" })
    }
  } catch (error) {
    console.log("error in loginUser", error)
    throw error
  }
}

// API to handle getting User data
export const getUser = async (request: Request, response: Response) => {
  try {
    const { uid } = request.params
    const user = await User.findOne({ uid })
    console.log(user)
    return response.status(200).send(user)
  } catch (error) {
    console.log("Error in getUser", error)
    throw error
  }
}

// API to handle updating user details
export const updateUser = async (request: Request, response: Response) => {
  try {
    const { uid } = request.params;
    const { name, email } = request.body;

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { name, email },
      { new: true }
    );

    return response.status(200).send({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.log("Error in updateUser", error);
    response.status(500).send("Error updating user");
  }
};