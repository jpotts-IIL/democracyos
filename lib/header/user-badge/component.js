import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import t from 't-component'
import config from 'lib/config'
import userConnector from 'lib/site/connectors/user'

class UserBadge extends Component {
  constructor (props) {
    super(props)

    this.state = {
      menuUserBadge: false,
      canChangeTopics: false
    }
  }

  componentDidMount () {
    bus.on('forum:change', this.setChangeTopicsPermission)
  }

  componentWillUnmount () {
    bus.off('forum:change', this.setChangeTopicsPermission)
  }

  setChangeTopicsPermission = (forum) => {
    this.setState({
      canChangeTopics: (forum && forum.privileges.canChangeTopics)
    })
  }

  toggleMenu = (e) => {
    this.setState({
      menuUserBadge: !this.state.menuUserBadge
    })
  }

  render () {
    const userAttrs = this.props.user.state.value
    let menuItemAdmin = null

    if (userAttrs.privileges && userAttrs.privileges.canManage) {
      if (config.multiForum) {
        menuItemAdmin = (
          <li>
            <Link to='/settings/forums'>
              {t('header.forums')}
            </Link>
          </li>
        )
      } else {
        menuItemAdmin = (
          <li>
            <Link to='/admin'>
              {t('header.admin')}
            </Link>
          </li>
        )
      }
    }

    const classes = ['user-badge', 'header-item']

    if (this.state.menuUserBadge) classes.push('active')

    return (
      <div className={classes.join(' ')} onClick={this.toggleMenu}>
        <button href='#' className='header-link'>
          <img src={userAttrs.avatar} alt='' />
          <span className='name hidden-xs-down'>{userAttrs.firstName}</span>
          <span className='caret hidden-xs-down' />
        </button>
        <ul
          className='dropdown-list'>
          {menuItemAdmin}
          <li className='notifications-li'>
            <Link to='/notifications'>{t('notifications.title')}</Link>
          </li>
          <li>
            <Link to='/settings'>
              {t('header.settings')}
            </Link>
          </li>
          {config.frequentlyAskedQuestions && <li><Link to='/help/faq'>{t('help.faq.title')}</Link></li>}
          {config.termsOfService && <li><Link to='/help/terms-of-service'>{t('help.tos.title')}</Link></li>}
          {config.privacyPolicy && <li><Link to='/help/privacy-policy'>{t('help.pp.title')}</Link></li>}
          {config.glossary && <li><Link to='/help/glossary'>{t('help.glossary.title')}</Link></li>}
          <li>
            <a
              onClick={this.props.user.logout}
              href='#'>
              {t('header.logout')}
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

export default userConnector(UserBadge)
