import _ from 'lodash';

import { h, Component } from 'preact'; //eslint-disable-line

import AlbumArt from './AlbumArt';
import BrowserListActions from '../actions/BrowserListActions';

class BrowserListItem extends Component {

    constructor () {
        super();
        this.state = {
            isExpanded: false,
        };
    }

    _onClick (e) {
        e.preventDefault();
        e.stopPropagation();

        const item = this.props.model;

        if(item.class === 'object.item.audioItem.musicTrack' || item.class === 'object.item.audioItem' || item.trackMetadata) {
            BrowserListActions.playNow(item);
        } else {
            BrowserListActions.select(item);
        }

        return false;
    }

    _playNow (e) {
        const item = _.get(this, 'props.model.parent') || this.props.model;
        BrowserListActions.playNow(item);
        this._toggle(e);
    }

    _playNext (e) {
        const item = _.get(this, 'props.model.parent') || this.props.model;
        BrowserListActions.playNext(item);
        this._toggle(e);
    }

    _addQueue (e) {
        const item = _.get(this, 'props.model.parent') || this.props.model;
        BrowserListActions.addQueue(item);
        this._toggle(e);
    }

    _replaceQueue (e) {
        const item = _.get(this, 'props.model.parent') || this.props.model;
        BrowserListActions.replaceQueue(item);
        this._toggle(e);
    }

    _removeService (e) {
        const item = this.props.model;
        BrowserListActions.removeService(item.service);
        this._toggle(e);
    }

    _toggle (e) {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
        e.preventDefault();
        e.stopPropagation();
    }

    _hideMenu (e) {
        if(this.state.isExpanded) {
            this.setState({
                isExpanded: false
            });
        }
    }

    _onMouseOut (e) {
        this._hideTimeout = window.setTimeout(this._hideMenu.bind(this), 500);
        e.preventDefault();
        e.stopPropagation();
    }

    _onMouseOver (e) {
        if(this._hideTimeout) {
            window.clearTimeout(this._hideTimeout);
        }
        e.preventDefault();
        e.stopPropagation();
    }

    render () {
        let inlineMenu;
        let inlineMenuButton;
        const item = this.props.model;
        let className = 'trackinfo';

        let artistInfo;

        if(item.class || item.action === 'service' || item.trackMetadata || JSON.parse(String(item.canPlay || 'false')) || JSON.parse(String(_.get(item, 'parent.canPlay') || 'false'))) {


            className = className + ' playable ';

            if(item.class) {
                className = className + /\.([-\w]+)$/gi.exec(item.class)[1];
            }

            if(item.itemType) {
                className = className + item.itemType;
            }

            inlineMenuButton = (
                <i className="material-icons arrow" onClick={this._toggle.bind(this)}>arrow_drop_down_circle</i>
            );

            if(this.state.isExpanded && (item.class === 'object.item.audioItem' || (item.metadata && item.metadata.class === 'object.item.audioItem.audioBroadcast'))) {
                inlineMenu = (
                    <ul className="inline-menu"
                        onMouseOut={this._onMouseOut.bind(this)}
                        onMouseOver={this._onMouseOver.bind(this)}>

                        <li onClick={this._playNow.bind(this)}>Play Now</li>
                    </ul>
                );
            } else if(this.state.isExpanded && item.action === 'service') {
                inlineMenu = (
                    <ul className="inline-menu"
                        onMouseOut={this._onMouseOut.bind(this)}
                        onMouseOver={this._onMouseOver.bind(this)}>

                        <li onClick={this._removeService.bind(this)}>Remove</li>
                    </ul>
                );
            } else if(this.state.isExpanded) {
                inlineMenu = (
                    <ul className="inline-menu"
                        onMouseOut={this._onMouseOut.bind(this)}
                        onMouseOver={this._onMouseOver.bind(this)}>

                        <li onClick={this._playNow.bind(this)}>Play Now</li>
                        <li onClick={this._playNext.bind(this)}>Play Next</li>
                        <li onClick={this._addQueue.bind(this)}>Add to Queue</li>
                        <li onClick={this._replaceQueue.bind(this)}>Replace Queue</li>
                    </ul>
                );
            }
        }

        const creator = item.creator || item.artist || _.get(item, 'trackMetadata.artist');
        const albumArtURI = item.albumArtURI || _.get(item, 'trackMetadata.albumArtURI');

        if(creator) {
            className += ' with-creator';

            artistInfo = (
                <p className="creator" title={creator}>{creator}</p>
            );
        }


        return (
            <li onClick={this._onClick.bind(this)}
                onMouseOut={this._onMouseOut.bind(this)}
                onMouseOver={this._onMouseOver.bind(this)}
                data-position={this.props.position}>

                <AlbumArt src={albumArtURI} />
                <div className={className}>
                    <p className="title" title={item.title}>{item.title}</p>
                    {artistInfo}
                </div>
                {inlineMenu}
                {inlineMenuButton}
            </li>
        );
    }
}

export default BrowserListItem;
