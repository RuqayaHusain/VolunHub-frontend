const EventFilter = (props) => {


    const handleChange = (evt) => {
        const { name, value } = evt.target;

        // removes symbols that might effect the filter query
        const newValue = (name === 'title' || name === 'location') ? value.replace(/[^\w\s-]/g, '') : value;

        if ((name === 'title' || name === 'location') && newValue !== value) {
            props.setValidationMessage('Filter only accepts letters, numbers, spaces, and hyphens');
            props.setFilter({ ...props.filter, [name]: '' }); // reset the value
            return;
        }

        const newFilter = { ...props.filter, [name]: newValue };

        if (newFilter.startDate && newFilter.endDate) {
            if (newFilter.startDate > newFilter.endDate) {
                newFilter.startDate = '';
                newFilter.endDate = '';
                props.setValidationMessage('End date must be after start date');
            } else {
                props.setValidationMessage('');
            }
        } else {
            props.setValidationMessage('');
        }
        props.setFilter(newFilter);

    };

    const handleReset = () => {
        props.setFilter({
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            category: '',
        });
        props.setValidationMessage('');
    };

    return (
        <section>
            {props.validationMessage && <p>{props.validationMessage}</p>}
            <h2>Filter</h2>
            <label htmlFor="title">Title</label>
            <input
                type="text"
                name="title"
                id="title"
                value={props.filter.title}
                onChange={handleChange}
            />
            <label htmlFor="location">Location</label>
            <input
                type="text"
                name="location"
                id="location"
                value={props.filter.location}
                onChange={handleChange}
            />
            <label htmlFor="startDate">Start Date</label>
            <input
                type="date"
                name="startDate"
                id="startDate"
                value={props.filter.startDate}
                onChange={handleChange}
            />
            <label htmlFor="endDate">End Date</label>
            <input
                type="date"
                name="endDate"
                id="endDate"
                value={props.filter.endDate}
                onChange={handleChange}
            />
            <label htmlFor="category">Category</label>
            <select
                name="category"
                id="category"
                value={props.filter.category}
                onChange={handleChange}
            >
                <option value="Community Service">Community Service</option>
                <option value="Education">Education</option>
                <option value="Environmental">Environmental</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Animal Care">Animal Care</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Sports & Recreation">Sports & Recreation</option>
                <option value="Human Rights">Human Rights</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Technology">Technology</option>
                <option value="Fundraising">Fundraising</option>
                <option value="Elderly Support">Elderly Support</option>
                <option value="Youth Empowerment">Youth Empowerment</option>
                <option value="Food Distribution">Food Distribution</option>
                <option value="Other">Other</option>
            </select>

            <button
                type="submit"
                onClick={handleReset}
            >
                Reset
            </button>

        </section>
    );

};

export default EventFilter;