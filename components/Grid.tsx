import React from 'react'
import { BentoGrid, BentoGridItem} from './ui/bento-grid'
import { FaCode } from 'react-icons/fa'
import { gridItems } from '../data/index'

const Grid = () => {
  return (
    <section id="about" className="px-4 sm:px-6 md:px-8 lg:px-10">
        <BentoGrid>
            {gridItems.map((item, i) => (
                <BentoGridItem 
                id={item.id}
                key={item.id}
                title={item.title}
                description={item.description}
                header={item.header}
                />
            ))}
        </BentoGrid>
    </section>
  )
}

export default Grid