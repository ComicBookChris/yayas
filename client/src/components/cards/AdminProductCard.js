import React from 'react';
import { Card } from 'antd';
import yayas from '../../images/yayas.png';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
    // destructure
    const { title, description, images, slug } = product;

    return (
        <Card
            cover={
                <img alt="Product Image" src={
                    images && images.length
                        ? images[0].url
                        : yayas
                }
                    style={{ height: "150px", objectFit: "cover" }}
                    className="p-1"
                />
            }

            actions={[
                <Link to={`/admin/product/${slug}`}>
                    <EditOutlined className="text-warning" />
                </Link>,
                <DeleteOutlined
                    onClick={() => handleRemove(slug)}
                    className="text-danger"
                />
            ]}
        >
        {JSON.stringify(product.title)}
            <Meta
                title={title}
                description={`${description && description.substring(0, 40)}...`}
            />
        </Card>
    )
}
export default AdminProductCard; 