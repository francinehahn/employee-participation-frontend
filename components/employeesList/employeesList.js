export function EmployeesList ({item}) {
    return (
        <div>
            <input type="radio" name="employee" id={item.employee_name} value={item.employee_name}/>
            <label htmlFor={item.employee_name}>{item.employee_name}</label>
        </div>
    )
}