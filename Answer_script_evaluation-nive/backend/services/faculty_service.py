faculty_db = {
    "IT101": "1234",
    "IT102": "abcd"
}


def authenticate(faculty_id, password):

    if faculty_id in faculty_db:

        if faculty_db[faculty_id] == password:

            return True

    return False