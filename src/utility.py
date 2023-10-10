# File Name: utility.py
# Job Board Sandbox
# Author: Libo Sun  libo@wrightmediacorp.com
# Created: Sept 24, 2023

import logging

FILE_LOG = "server_records.log"


def init_log():
    """
    initialize log file
    """
    logging.basicConfig(
        filename=FILE_LOG,
        level=logging.INFO,
        format=f"%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s",
    )


def clear_log():
    with open(FILE_LOG, "w") as f:
        f.write("")
    f.close()
