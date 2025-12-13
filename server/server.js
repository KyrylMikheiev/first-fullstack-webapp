const app = require('./app');
const port = process.env.PORT || 4010;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
