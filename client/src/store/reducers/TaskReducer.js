const initialState = {
    tasks : [],
    uploading: false
}

function TaskReducer (state = initialState, action) {
    const {payload, type} = action
    if (type === 'task/fetch') return {...state, tasks : payload}
    else if (type === 'task/clear') return {...state, tasks : []}
    else if (type === 'task/uploading') return {...state, uploading : true}
    else if (type === 'task/uploaded') {
        const temp = JSON.parse(JSON.stringify(state.tasks))
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id === payload.id) temp[i][payload.type] = JSON.stringify(payload.data)
        }
        return {...state, uploading : false, tasks: temp}
    }
    else if (type === 'task/patch') {
        const temp = JSON.parse(JSON.stringify(state.tasks))
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id === payload.id) temp[i] = payload
        }
        return {...state, tasks: temp}
    }
    else if (type === 'task/delete') {
        const temp = JSON.parse(JSON.stringify(state.tasks))
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id === payload.id) temp.splice(i, 1)
        }
        return {...state, tasks: temp}
    }
    else if (type === 'task/deleteInput') {
        const temp = JSON.parse(JSON.stringify(state.tasks))
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id === payload.id) temp[i].input = null
            
        }
        return {...state, tasks: temp}
    }
    else if (type === 'task/deleteOutput') {
        const temp = JSON.parse(JSON.stringify(state.tasks))
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id === payload.id) temp[i].hasil = null
            
        }
        return {...state, tasks: temp}
    }
    else if (type === 'task/put') {
        const temp = JSON.parse(JSON.stringify(state.tasks))
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id === payload.id) temp[i] = payload
            
        }
        return {...state, tasks: temp}
    }
    return {...state}
}

export default TaskReducer