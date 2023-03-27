const setNames = (data) => {
    let names = data.map((item) => {
        return { slug: item }
    })
    return names;
}
const makeIDs = (data) => {
    let ids = data.map((item) => item._id)
    return ids
}
export { setNames, makeIDs }