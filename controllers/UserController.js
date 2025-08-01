import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/user.js'

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatar: req.body.avatar,
      passwordHash: hash,
      role: req.body.role || 'student',
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло зареєструватися",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Невірний логін або пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Невірний логін або пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
        ...userData,
        token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося авторизуватися",
    });
  }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Користувача не знайдено'
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({...userData,});
    }
    catch (err){
        res.status(500).json({
            message: 'Доступ відсутній!',
        });
    };
};