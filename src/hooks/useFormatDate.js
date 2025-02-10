const useFormatDate = (dateString) => {
    const inputDate = new Date(dateString);

    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = inputDate.toLocaleDateString('en-US', options);

    return formattedDate;
}

export default useFormatDate;