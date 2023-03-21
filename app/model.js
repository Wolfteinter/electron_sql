'use strict'
const path = require('path')
const fs = require('fs')
//import { sqlite3 } from 'sqlite3'
const sqlite3 = require('sqlite3').verbose();

const dbOpen = function (databaseFileName) {
    try {
        return new sqlite3.Database(fs.readFileSync(databaseFileName))
    } catch (error) {
        console.log("Can't open database file.", error.message)
        return null
    }
}

const dbClose = function (databaseHandle, databaseFileName) {
    try {
        let data = databaseHandle
        let buffer = Buffer.alloc(data.length, data)
        fs.writeFileSync(databaseFileName, buffer)
        databaseHandle.close()
        return true
    } catch (error) {
        console.log("Can't close database file.", error)
        return null
    }
}

export function initDb (appPath, callback) {
    let dbPath = path.join(appPath, 'example2.db')
    let createDb = function (dbPath) {
        console.log("creating")
        const db = new sqlite3.Database(':memory:')
        let query = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8')
        let result;
        db.serialize(() => {
            result = db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)', (err) => {
                console.log(err)
            });
          });
          console.log(result)
        dbClose(db, dbPath)
        console.log("all good")
    }
    let db = dbOpen(dbPath)
    if (db === null) {
        createDb(dbPath)
    }
    if (typeof callback === 'function') {
        callback()
    }
}