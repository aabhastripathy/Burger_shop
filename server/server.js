require("dotenv").config()
const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express();
const host = process.env.HOST;
const port = process.env.PORT || 3000 ;
app.use(cors());
app.use(express.json());


app.post("/confirm-order",(request,response)=>{
    const newOrder = request.body;
    console.log("Received new Order: ",newOrder);
    newOrder.id = Date.now();
    newOrder.timestamp = new Date().toISOString();
    fs.readFile("orders.json","utf8",(error,data)=>{
        if(error){
            console.error(error);
            return response.status(500).json({message:"Error reading from database"});
        }
        const orders = JSON.parse(data);
        orders.push(newOrder);
        fs.writeFile("orders.json",JSON.stringify(orders,null,2),(error)=>{
            if(error){
                console.log(error);
                return response.status(500).json({message : "Error saving order"});
            }
            console.log("Order saved successfully")
            response.status(201).json({message:"Order confirmed and saved",order : newOrder});
        });
    });
});

app.listen(port,()=>{
    console.log(`BurgerBuilder server running on http://${host}:${port}`)
})
