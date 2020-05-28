import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchParameters, SearchResult } from '@gsa-sam/layouts';

import { userDirectoryData } from './user.data';

/**
 *  The integrity service emulates basic sorting and filtering for most of the filters (except keyword).
 */
@Injectable()
export class UserDirectoryService {
	

	constructor() { }

    /*
     * Here is the main method that the design system calls
     */
	getData(search: SearchParameters): Observable<SearchResult> {

		let records = userDirectoryData;

        /* Filter */
        if(search && search.filter) {			
        	records = userDirectoryData.filter(record => this.filterRecord(record, search.filter))
        }

		/* Sort */
		this.sortRecords(records, search);

		/* Return slice */
		const start = search.page.pageNumber * search.page.pageSize - search.page.pageSize;
		const end = start + search.page.pageSize;
		return of({
			items: records.slice(start, end),
			totalItems: records.length
		});
	}

	//Filter records given the filter object containing the formly filter model
	filterRecord(record, filter) {

		if (filter.role) {
			const answer = this.filterRoleType(record, filter.role);
			if(!answer){return false; }
		}

		if(filter.department && filter.department.length > 0) {
    		if(!this.hasDepartment(record, filter.department)) {
    			return false;
    		}
		}
		
		return true;
	}

	filterRoleType(record, roleFilters) {
		const trueValues: string[] = Object.entries(roleFilters).filter(([k, v]) => {
			return v === true;
		}).map(([k, v]) => { return k });
		if(trueValues.length<1){
			return true;
		}
		return trueValues.includes(record.role);
	}
	
	hasDepartment (record, departmentList){
			for (let department of departmentList){
				if(department.value == record.department) {					
					return true;
				}			
			}
			return false;
	}

    sortRecords(records, search: SearchParameters) {
        records.sort((a, b) => {
            switch (search.sortField) {
            	case 'userAscending':
            		return (a.givenName > b.givenName) ? 1 : -1;
            	case 'userDescending':
            		return (a.givenName > b.givenName) ? -1 : 1;
            	default: {
            		return (a.givenName > b.givenName) ? 1 : -1;
            	}
           }
		});
	}
}

