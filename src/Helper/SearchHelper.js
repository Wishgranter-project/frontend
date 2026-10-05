
class SearchHelper
{
    static populateSearch(search, queryParams)
    {
        var operator;
        var title = queryParams.get('title');
        if (title) {
            operator = SearchHelper.getOperator(title);
            title = SearchHelper.stripQuotes(title);
            search.condition('title', title, operator);
        }

        var artist = queryParams.get('artist');
        if (artist) {
            operator = SearchHelper.getOperator(artist);
            artist = SearchHelper.stripQuotes(artist);
            search.orConditionGroup()
                .condition('artist', artist, operator)
                .condition('featuring', artist, operator);
        }

        var genre = queryParams.get('genre');
        if (genre) {
            operator = SearchHelper.getOperator(genre);
            genre = SearchHelper.stripQuotes(genre);
            search.condition('genre', genre, operator);
        }

        var soundtrack = queryParams.get('soundtrack');
        if (soundtrack) {
            operator = SearchHelper.getOperator(soundtrack);
            soundtrack = SearchHelper.stripQuotes(soundtrack);
            search.condition('soundtrack', soundtrack, operator);
        }

        const page = queryParams.get('page');
        if (page) {
            search.page(page);
        }
    }

    static getOperator(string)
    {
        return string.match(/^ *".*" *$/)
            ? 'IN'
            : 'LIKE';
    }

    static stripQuotes(string)
    {
        return string
            .replace(/^ *" */, '')
            .replace(/ *" *$/, '');
    }
}

export default SearchHelper;
