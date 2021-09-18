import express, { Request } from 'express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

type Task = {
  id: number;
  name: string;
  complete: boolean;
}

const tasks: Task[] = []

let currentId: number = 1

//get name and student code
app.get('/me', (req, res) => {
  return res.status(200).json({ name: 'Nattapon Tancho' , code: '620610786'})
})

//post new task
app.post('/todo', (req: Request<{}, {}, Task>, res) => {
  //check if property in body have correct type
  if(typeof(req.body.name) === "string" && 
      typeof(req.body.complete) === "boolean" && 
      req.body.name !== "")
  {
    const newTask: Task = {
      id: currentId,
      name: req.body.name,
      complete: req.body.complete
    }
    tasks.push(newTask)
    currentId += 1
    return res.status(200).json({status: "success", tasks: tasks})
  }
  //property have incorrect type
  else
  {
    return res.status(400).json({status: "failed", message: "invalid input data"})
  }
})

//show all task
app.get('/todo', (req, res) => {

  // try to call /todo?q1=data1&q2data2
  // you can read query parameters with "req.query"
  if(req.query.order == "asc"){
    tasks.sort(function(a, b){
      let nameA = a.name.toUpperCase(), nameB = b.name.toUpperCase()
      if(nameA < nameB){ return -1}
      if(nameA > nameB){ return 1}
      return 0
    })
  }else if(req.query.order == "desc")(
    tasks.sort(function(a, b){
      let nameA = a.name.toUpperCase(), nameB = b.name.toUpperCase()
      if(nameA > nameB){ return -1}
      if(nameA < nameB){ return 1}
      return 0
    })
  )

  return res.json({ status: 'success', tasks: tasks})
})


//Heroku will set process.env.PORT to server port
//But if this code run locally, port will be 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Server is running at port' + port)
})