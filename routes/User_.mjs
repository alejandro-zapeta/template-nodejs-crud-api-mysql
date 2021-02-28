import express from "express";
import MyDb from '../MyDb.mjs';

const User_ = express.Router();

const create = async (req, res) => {
    try {
        let data = req.body["user"];
        // 1992-01-01
        data["BirthDate"] = new Date(data["BirthDate"]);
        let response = await MyDb.execStatement(`insert into User_ SET ?`, data);
        res.json({ "code": 200, "IdCreated": response });
    } catch (ex) {
        res.json({ "code": 500, "errormsg": JSON.stringify(ex) })
    }
}

const update = async (req, res) => {
    try {
        let data = req.body["user"];
        data["BirthDate"] = new Date(data["BirthDate"]);
        let userId = req.params.userId;
        await MyDb.execStatement(`update User_ SET ? where UserId=?`, [data, parseInt(userId)]);
        res.json({ "code": 200 });
    } catch (ex) {
        res.json({ "code": 500, "errormsg": JSON.stringify(ex) })
    }
}

const read = async (req, res) => {
    try {
        let result = await MyDb.query(`select * from User_`);
        // process something
        res.json({ "code": 200, "users": result });
    } catch (ex) {
        res.json({ "code": 500, "errormsg": JSON.stringify(ex) })
    }
}

const delete_ = async (req, res) => {
    try {
        let userId = req.params.userId;
        await MyDb.execStatement(`delete from User_ where UserId=?`, [parseInt(userId)]);
        res.json({ "code": 200 });
    } catch (ex) {
        res.json({ "code": 500, "errormsg": JSON.stringify(ex) })
    }
}

User_.post("/", create);
User_.put("/:userId", update);
User_.get("/", read);
User_.delete("/:userId", delete_);

export default User_;