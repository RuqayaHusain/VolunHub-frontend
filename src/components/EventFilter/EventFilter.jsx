const EventFilter = (props) => {

    
    const handleChange = (evt) => {
        const { name, value } = evt.target;

        const newFilter = { ...props.filter, [name]: value };

        if (newFilter.startDate && newFilter.endDate) {
            if (newFilter.startDate > newFilter.endDate) {
                newFilter.startDate = "";
                newFilter.endDate = "";
                props.setValidationMessage('End date must be after start date');
            } else {
                props.setValidationMessage('');
            }
        } else {
            props.setValidationMessage('');
        }
        props.setFilter(newFilter);

    };

    return (
        <section>
                {props.validationMessage && <p>{props.validationMessage}</p>}
                <h2>Filter</h2>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    value={props.filter.title}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="location"
                    id="location"
                    placeholder="Location"
                    value={props.filter.location}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    placeholder="Start Date"
                    value={props.filter.startDate}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    placeholder="End Date"
                    value={props.filter.endDate}
                    onChange={handleChange}
                />
                <select
                    name="category"
                    id="category"
                    placeholder="Category"
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

            </section>
    );

};

export default EventFilter;