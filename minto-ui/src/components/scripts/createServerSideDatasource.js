const BASE_URL = import.meta.env.VITE_API_URL;

export const createServerSideDatasource = (endPoint) => {
  return {
    getRows: (params) => {
      console.log('AG Grid request params:', params.request);

      // Get the start and end row index from the request
      const { startRow, endRow } = params.request;

      // Make an actual API call to your server
      fetch(`${BASE_URL}/${endPoint}?startRow=${startRow}&endRow=${endRow}`)
        .then(response => response.json())
        .then(data => {
          // Assuming your server response has a 'rows' array and a 'lastRowIndex'
          params.success({
            rowData: data.rows,
            // The correct lastRowIndex must be supplied in the response
            // Use data.lastRowIndex if provided, otherwise null or a calculated value
            // indicating if this is the last page
            rowCount: data.lastRowIndex // e.g., 100 in total
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          params.fail();
        });
    },
  };
};
