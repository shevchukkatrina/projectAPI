const db = require('./db');

const Instructor = function (instructor) {
    this.id = instructor.id;
    this.first_name = instructor.first_name;
    this.last_name = instructor.last_name;
    this.middle_name = instructor.middle_name;
    this.phone = instructor.phone;
    this.address = instructor.address;
    this.birth_date = instructor.birth_date;
    this.start_date = instructor.start_date;
};

Instructor.getAll = async () => {
    const query = 'SELECT * FROM instructor';
    const rows = await db.query(query);
    return rows;
};

Instructor.count = async () => {
    const query = 'SELECT COUNT(*) as count FROM instructor;';
    const count = await db.query(query);
    return count;
};

Instructor.create = async data => {
    const { id, first_name, last_name, middle_name, phone, address } = data;
    const query = `
    INSERT INTO instructor (id, first_name, last_name, middle_name, phone, address) 
    VALUES (${id}, "${first_name}", "${last_name}", "${middle_name}", "${phone}", "${address}")`;
    const rows = await db.query(query);
    return rows;
};

Instructor.delete = async id => {
    const query = `
    DELETE FROM instructor 
    WHERE id = ${id}`;

    const rows = await db.query(query);
    return rows;
};

module.exports = Instructor;
