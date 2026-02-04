module.exports = {
    GROUPS: {
        USERS: {
            id: "USERS",
            name: "User Permissions"
        },
        RECORDS: {
            id: "RECORDS",
            name: "Record Permissions"
        },
        ROLES: {
            id: "ROLES",
            name: "Role Permissions"
        }
    },

    PRIVILEGES: {
        USER_VIEW: {
            key: "user_view",
            name: "User View",
            group: "USERS",
            description: "User view information"
        },
        USER_UPDATE: {
            key: "user_update",
            name: "User Update",
            group: "USERS",
            description: "User update information"
        },
        USER_DELETE: {
            key: "user_delete",
            name: "User Delete",
            group: "USERS",
            description: "User delete information"
        },
        RECORD_CREATE: {
            key: "record_create",
            name: "Record Create",
            group: "RECORDS",
            description: "Record create information"
        },
        RECORD_VIEW: {
            key: "record_view",
            name: "Record View",
            group: "RECORDS",
            description: "Record view information"
        },
        RECORD_UPDATE: {
            key: "record_update",
            name: "Record Update",
            group: "RECORDS",
            description: "Record update information"
        },
        RECORD_DELETE: {
            key: "record_delete",
            name: "Record Delete",
            group: "RECORDS",
            description: "Record delete information"
        },
        ROLE_CREATE: {
            key: "role_create",
            name: "Role Create",
            group: "ROLES",
            description: "Role create information"
        },
        ROLE_VIEW: {
            key: "role_view",
            name: "Role View",
            group: "ROLES",
            description: "Role view information"
        },
        ROLE_UPDATE: {
            key: "role_update",
            name: "Role Update",
            group: "ROLES",
            description: "Role update information"
        },
        ROLE_DELETE: {
            key: "role_delete",
            name: "Role Delete",
            group: "ROLES",
            description: "Role delete information"
        }
    }
};