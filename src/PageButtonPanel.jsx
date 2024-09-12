const PageButton = ({ onClick, text, condition }) => {
    if (!condition) return null;
  
    return (<button onClick={onClick}>{text}</button>)
}

const PageButtonPanel = ({ handleFirstPage, handleNext, handlePrev, handleLastPage, page, results }) => {
    const showFirstPageButton = parseInt(page, 10) > 1 && results > 10;
    const showNextPageButton = ((results - (parseInt(page, 10)) * 10) > 0 && results > 10);
    const showPrevPageButton = parseInt(page, 10) > 1 && results > 10;
    const showLastPageButton = parseInt(page, 10) < Math.ceil(parseInt(results, 10) / 10) && results > 10;

    return (
    <>


        {showFirstPageButton && (
            <button onClick={handleFirstPage}>&laquo;</button>
        )}

        {showPrevPageButton && (
            <button onClick={handlePrev}>&lt;</button>
        )}

        {showNextPageButton && (
            <button onClick={handleNext}>&gt;</button>
        )}

        {showLastPageButton && (
            <button onClick={handleLastPage}>&raquo;</button>
        )}
    </>
    )
}
  
export default PageButtonPanel;  