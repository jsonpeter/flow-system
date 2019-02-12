const taskCtr= require('../controllers/task_controller');
module.exports = {
    taskStart: () => {
        let number=0,new_number=0,storeId=0;
        taskCtr.select_all((data_num) => {
            taskCtr.select_new(data_num => {
                taskCtr.install_log()
            })
        })
    }
}
