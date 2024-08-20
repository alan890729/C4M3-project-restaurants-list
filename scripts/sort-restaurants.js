module.exports = {
    getOrderCondition(sortStatus) {

        let condition = []

        switch (sortStatus) {
            case 'alphabetAsc':
                condition = [['name_en', 'ASC']]
                break
            case 'alphabetDesc':
                condition = [['name_en', 'DESC']]
                break
            case 'categories':
                condition = [['category', 'ASC']]
                break
            case 'location':
                condition = [['location', 'ASC']]
                break
        }

        return condition

    },

    sortButtonActiveSwitcher(res, sortStatus) {

        switch (sortStatus) {
            case 'alphabetAsc':
                res.locals.alphabetAsc = 'on'
                break
            case 'alphabetDesc':
                res.locals.alphabetDesc = 'on'
                break
            case 'categories':
                res.locals.categories = 'on'
                break
            case 'location':
                res.locals.location = 'on'
                break
        }

    }
}