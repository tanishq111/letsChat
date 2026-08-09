
export const getUser = (req, res) => { // this api will define what it is expecting from you.
    console.log("User routeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    const id = 6;
    res.status(200).json({ message: `User ID: ${id }` });
};


export const createUser = (req, res) => {
    console.log("User routeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    const { name, email } = req.body;
    res.status(200).json({ message: `Hello, ${name}!` });
};  