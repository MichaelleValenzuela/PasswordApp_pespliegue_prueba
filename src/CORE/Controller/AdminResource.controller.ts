

export const adminCreateResource= async(req:any, res:any)=>{
    res.json({
        msg: "ADMIN: CREANDO RESOURCE"
    })
}

export const adminGetResources= async(req:any, res:any)=>{
    res.json({
        msg: "ADMIN: GET RESOURCES"
    })
}

export const adminEditResource= async(req:any, res:any)=>{
    res.json({
        msg: "ADMIN: EDITANDO RESOURCE"
    })
}

export const adminDeleteResource= async(req:any, res:any)=>{
    res.json({
        msg: "ADMIN: ELIMINANDO RESOURCE"
    })
}

// URI_ADMIN_RESOURCE: ["/admin/create-resource", "/admin/get-resources", "/admin/edit-resource/:id", "/admin/delete-resource/:id"],
