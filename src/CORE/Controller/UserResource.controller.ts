

export const userCreateResource= async(req:any, res:any)=>{
    res.json({
        msg: "USER: CREANDO RESOURCE"
    })
}

export const userGetResources= async(req:any, res:any)=>{
    res.json({
        msg: "USER: GET RESOURCES"
    })
}

export const userEditResource= async(req:any, res:any)=>{
    res.json({
        msg: "USER: EDITANDO RESOURCE"
    })
}

export const userDeleteResource= async(req:any, res:any)=>{
    res.json({
        msg: "USER: ELIMINANDO RESOURCE"
    })
}

