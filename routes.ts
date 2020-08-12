import { Router } from 'https://deno.land/x/oak/mod.ts'
import { addTask, getTasks, getTask, deleteTask, updateTask } from './Controllers/tasks.ts'                           

const router = new Router()


router.post('/api/v1/tasks', addTask)
router.get('/api/v1/tasks', getTasks)
router.get('/api/v1/tasks/:id', getTask)
router.delete('/api/v1/tasks/:id', deleteTask)
router.put('/api/v1/tasks/:id', updateTask)

router.get('/', ({response} : {response:any}) => {
    response.body = "Routing Works"
})                


export default router
