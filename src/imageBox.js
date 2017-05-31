import React from 'react';

// our main image box, it uses dangerouslySetInnerHTML to process the description part of the flickr metadata.

export class ImageBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: true };
    }

	render() {
	
	// this code isn't necessary, but is good react practice for hiding components.
	
		let tag_div = <div />;
        if (!this.state.visible) {
            return <div />;
        } else {
			const c_string = `${this.props.title} by ${this.props.author}`
			if (this.props.tags) {
				const t_string = `tags: ${this.props.tags}`
				tag_div = <span className="tags">{t_string}</span>;
			}
		
			
			function createDescHTML(h) { return {__html: h}; };
		
            return (
                <div className="box_wrapper">
                    <div className="upper">
                        <div className="thumbnail">
                            <img src={this.props.img_url} alt="" />
                        </div>
                    </div>
                    <div className="lower">
                        <span className="title">{c_string}</span>
						{tag_div}
						<span className="desc"><div dangerouslySetInnerHTML={createDescHTML(`<span class="desc_text">description:</span><div class="desc_html">${this.props.desc}</div>`)} /></span>
					</div>
                </div>
            );
        }
    }
}
