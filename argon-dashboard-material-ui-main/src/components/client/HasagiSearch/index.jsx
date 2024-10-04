import React from 'react';
import ArgonInput from 'components/ArgonInput';
import ArgonBox from 'components/ArgonBox';
const Search = () => {
    return (
        <div className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h4 className="modal-title mb-0" id="exampleModalLabel">Search by keyword</h4>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body d-flex align-items-center">
                        <div className="input-group w-75 mx-auto d-flex">
                            <ArgonInput name="search" type="text" placeholder="Keywords"
                                endAdornment={<ArgonBox component="i" className="ni ni-app" ml={1} />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Search