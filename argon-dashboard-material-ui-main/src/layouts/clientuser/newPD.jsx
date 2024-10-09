import React from 'react';
import HasagiCard2 from 'components/client/HasagiCard/Card2';

const newPD = [
    {
        image: 'https://liblibai-online.liblib.cloud/web/image/f483950cc3b91372c00296aca80f2a84021f32c4aee2d1fb3664797885bb47d0.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product One',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis non dolore est fuga nobis ipsum illum eligendi nemo iure repellat, soluta, optio minus ut reiciendis voluptates enim impedit veritatis officiis.',
        price: 10000,
        sold: 0,
        id: 1
    },
    {
        image: 'https://liblibai-online.liblib.cloud/web/image/8a6b84ad351356da89be2866e7fbd4071526479bdf8f8d55f3551e6a8513a06c.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Two',
        description: 'Amet consectetur adipisicing elit. Autem facilis assumenda adipisci debitis quod, minus quia consequatur accusamus doloremque!',
        price: 15000,
        sold: 10,
        id: 2
    },
    {
        image: 'https://liblibai-online.liblib.cloud/web/image/d330700521b12b96b9d6fef3d15dd4b1337748544b9f836901698707aeb2a504.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Three',
        description: 'Repellat, soluta, optio minus ut reiciendis voluptates enim impedit veritatis officiis.',
        price: 12000,
        sold: 25,
        id: 3
    },
    {
        image: 'https://liblibai-online.liblib.cloud/web/image/c6ec27ff7cfab2d6be44f464183aff15f12252de6a6feec468461e57d7fc9b1f.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Four',
        description: 'Illum eligendi nemo iure repellat soluta, optio minus ut reiciendis voluptates enim impedit veritatis.',
        price: 20000,
        sold: 40,
        id: 4
    },
    {
        image: 'https://liblibai-online.liblib.cloud/web/image/9def47591fdf3287d9a56f2eff57733608a54096ae2b5559c3d2b30f5899dca5.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Five',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis non dolore est fuga nobis ipsum illum eligendi nemo iure.',
        price: 18000,
        sold: 55,
        id: 5
    },
    {
        image: 'https://liblibai-online.liblib.cloud/web/image/53f2d772a18bfe0fcd5c5f0eba85bda5d266856728b0ba76284d1b3e1e4c420f.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Six',
        description: 'Distinctio rerum temporibus totam ullam molestiae facilis.',
        price: 13000,
        sold: 70,
        id: 6
    },
    {
        image: 'https://liblibai-online.liblib.cloud/web/image/c891ab8e456a95bc9d4cbd1e48eac417ab06d2a95e451450b21091ce34e6c42e.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Seven',
        description: 'Voluptatum quo quae maxime, voluptate saepe facilis sapiente.',
        price: 25000,
        sold: 80,
        id: 7
    },
    {
        image: 'https://liblibai-online.liblib.cloud/web/image/6badeb00805adad5478d8b68bf97b387e503584e7631d42fb10824149d12b77e.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Eight',
        description: 'Consequatur suscipit quasi dolorum expedita fuga deserunt.',
        price: 30000,
        sold: 35,
        id: 8
    },
    {
        image: 'https://liblibai-online.liblib.cloud/img/005e6497fced459ea5e88e2e5ccf57a3/41643c3d79c91805ba4455439f61ba03aa9ab92f37d54d153ce15bb2d1f6d89f.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Nine',
        description: 'Cumque voluptate aperiam rem, minus voluptates saepe dignissimos.',
        price: 22000,
        sold: 90,
        id: 9
    },
    {
        image: 'https://liblibai-online.liblib.cloud/img/005e6497fced459ea5e88e2e5ccf57a3/34082f31f4891c0f73a4df786ef7facf32587b5122a85dad99e17dbcd3946643.png?x-oss-process=image/resize,w_764,m_lfit/format,webp',
        name: 'Product Ten',
        description: 'Quidem nisi distinctio ducimus porro doloribus eligendi natus.',
        price: 17000,
        sold: 120,
        id: 10
    }
];

const NewProduct = () => {
    return (
        <div>
        {newPD.map((pd) => (
            <HasagiCard2
                key={pd.id}
                id={pd.id}
                image={pd.image}
                name={pd.name}
                price={pd.price}
                sale={pd.sold}
            />
        ))}
    </div>
    )
}

export default NewProduct;