import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import CollectionCover from '../../../../components/generics/CollectionCover'

import tM from '../../../../services/content/type'

import styles from './CollectionBox.scss'


const CollectionBox = ({
  ratio,
  collection: {
    cover_elements: covers,
    title,
    type,
    pk,
  },
}) => {
  const Icon = tM.read(type).icon()
  return (
    <div className={styles.CollectionBox} data-ratio={ratio}>
      <Link to={`/collections/${type}/${pk}/`}>
        <CollectionCover covers={covers} ratio={ratio} />
        <Icon className={styles.Icon} />
        <div className={styles.Title} >
          {title}
        </div>
      </Link>
    </div>
  )
}

CollectionBox.propTypes = {
  collection: PropTypes.object.isRequired,
  ratio: PropTypes.number.isRequired,
}

export default CollectionBox
