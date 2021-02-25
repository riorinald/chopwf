

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

const sortingArrayStr = (data = [], param = "", lang="zh-CN-u-co-pinyin", isNumeric=true) => {
    data.sort((a, b) => {

        return a[param].localeCompare(b[param], [ lang ], {numeric: isNumeric}); 
        })
}

const convertDate = (dateValue) => {
    let converted = null
    if (dateValue !== "" && dateValue !== undefined) {
        let regEx = dateValue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
        converted = new Date(regEx)
    }
    return converted
}

const CommonFn = ({sortingString, sortingArrayStr, convertDate})

export default CommonFn;