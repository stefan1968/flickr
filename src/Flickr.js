import React from 'react';
import $ from 'jquery';
import { ImageBox } from './imageBox';


// we use a pure react component here as it doesn't require a state.

const RenderRow = props => {
    const { tiles } = props;
    const t_array = [];
    tiles.forEach(o => {
        t_array.push(o);
    });
    return (
        <div className="section group">
            {t_array}
        </div>
    );
};

export class FlickrGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
        this.flickr_data = []; // this array hold our marshalled data from the flickr api.
        this.base_url = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?';
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        // At this stage no render has taken place, its safe to do our Restful API fetch here.
        this.populateOrAppendData(() => {
			this.setState({ visible: true });
			
			// This is a nifty trick to ensure first render has taken place.
            setTimeout(() => {
                document.addEventListener('scroll', this.handleScroll);
            }, 0);
        });
	}
	
	componentWillUnMount() {
		// although this is not called, its really good practice to de-register any events.
		document.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll() {
		// test if scroll is at bottom, we already ensure react has flushed to the dom at this point, 
		// as we added the scroll listener after first render

		if ($(window).scrollTop() + $(window).height() === $(document).height()) {
			this.populateOrAppendData(() => {
				this.setState({ visible: true });
			});
        }
    }


    populateOrAppendData(cb) {
		$.getJSON(this.base_url, result => {
			const { items } = result;
			// We have the data, presumably...now filter and marshal it to something useful.
			items.forEach(o => {
				this.flickr_data.push({
					author: o.author,
					title: o.title,
					desc: o.description,
					tags: o.tags,
					img: o.media.m
				});
			});
			if (cb) {
				cb();
			}
		}).fail(function () {
			console.log("error failed to load data");
		});
    }
	prepareTiles() {
		
		// populate our tile array.

        const tile_array = [];
        this.flickr_data.forEach((tile, i) => {
            const k_class = `col span_1_of_4`; // we allow for width of 4 tiles.
            tile_array.push(
				<div key={`tile_key_${i}`} className={k_class}><ImageBox tags={tile.tags} desc={tile.desc} title={tile.title} author={tile.author} img_url={tile.img} /></div>
            );
        });
        return tile_array;
    }

	render() {
		// this is our main render, it uses a range of sub components to display the tiles in order.

        const render_array = [];
        if (!this.state.visible) {
            return <div />;
        } else {
			const tiles = this.prepareTiles();
			let idx = 0;
            do {
				const my_tiles = tiles.splice(0, 4);
                render_array.push(<RenderRow key={`my_key_${idx++}`} tiles={my_tiles} />);
            } while (tiles.length > 0);
            return (
                <div
                    ref={scroll => {
                        this.refScroll = scroll;
                    }}
                >
                    {render_array}
                </div>
            );
        }
    }
}
