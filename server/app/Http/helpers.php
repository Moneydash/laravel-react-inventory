<?php

if (!function_exists('paginate_table')) {
    function paginate_table($page, $per_page, $search, $model, $with, $search_columns) {
        // Check if $with and $search_columns are arrays
        if (!is_array($with) || !is_array($search_columns)) {
            return;
        }

        // Check if the $model is an instance of the Eloquent model class
        if (!$model instanceof \Illuminate\Database\Eloquent\Model) {
            return;
        }

        // Initialize the query with eager loading
        $query = $model::with($with)->orderBy("created_at", "desc");

        // If a search term is provided, filter by the search columns
        if ($search) {
            $query->where(function($q) use ($search, $search_columns) {
                foreach ($search_columns as $key) {
                    $q->orWhere($key, 'like', "%{$search}%");
                }
            });
        }

        // Get the paginated query results
        $paginatedResults = $query->paginate($per_page, ['*'], 'page', $page);

        // Convert the paginated results to an array and add the search term
        $resultsArray = $paginatedResults->toArray();
        $resultsArray['search'] = $search;  // Add the search term to the response

        // Return the modified results
        return $resultsArray;
    }
}

?>
