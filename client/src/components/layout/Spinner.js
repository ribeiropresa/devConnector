import React, { Fragment } from 'react';
import spinner from '../../img/Eclipse-1s-200px.gif';

export default () => (
    <Fragment>
        <section className='container'>
            <img 
                src={spinner}
                style={{width:'200px', margin:'auto', display:'block'}}
                alt='Loading...'
            />
        </section>
    </Fragment>
);