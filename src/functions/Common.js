

const sortingString = (a, b, lang=["zh-CN"], _order) => {

    let order = "asc"
    // Replace internal parameters if not used
    if (_order == null) _order = order;

    // If values are null place them at the end
    let dflt = (_order == "asc" ? Number.MAX_VALUE : -Number.MAX_VALUE);
    
    //String values
    let aVal = (a == null ? dflt : a).toString();
    let bVal = (b == null ? dflt : b).toString();
    return _order == "asc" ? 
    aVal.localeCompare(bVal, undefined, {numeric: true}) : bVal.localeCompare(aVal, undefined, {numeric: true});

}

const CommonFn = ({sortingString})

export default CommonFn;