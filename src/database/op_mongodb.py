# File Name: database/op_mongodb.py
# Job Board Sandbox
# Author: Libo Sun  libo@wrightmediacorp.com
# Created: Sept 24, 2023

import logging
import pymongo


MONGO_URI = "mongodb+srv://libo:<password>@cluster0.qwij9yh.mongodb.net/"
OP_NON_EMPTY = ["$or"]


def mdb_conn(db_name):
    "connect to MongoDB Atlas and return the database"
    uri = MONGO_URI
    try:
        client = pymongo.MongoClient(uri)
        return client[db_name]
    except Exception as e:
        logging.error(f" ! Failed connecting the database, {e}")
        return None


def mdb_insert_one(d):
    """insert one document into MongoDB Atlas"""
    try:
        db = mdb_conn(d.__db_name__)
        return db[d.__collection__].insert_one(d.__dict__)

    except Exception as e:
        logging.error(f" ! Failed inserting data, {e}")
        return None


def mdb_insert_many(d, documents):
    """insert multiple documents into MongoDB Atlas"""
    try:
        db = mdb_conn(d.__db_name__)
        return db[d.__collection__].insert_many(documents)

    except Exception as e:
        logging.error(f" ! Failed inserting data, {e}")
        return None


def mdb_find_all(d, query):
    """read and return all documents by filter"""
    db = mdb_conn(d.__db_name__)
    return db[d.__collection__].find(query)


def mdb_find_one(d, query):
    """read and return one document by filter"""
    db = mdb_conn(d.__db_name__)
    return db[d.__collection__].find_one(query)
