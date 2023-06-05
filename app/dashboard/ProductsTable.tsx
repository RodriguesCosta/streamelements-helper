'use client';

import React,{useEffect, useState} from 'react';

import Link from 'next/link';

export const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/stream-elements/all-products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
      });
  },[])
  
  const headers = ['Nome', ''];

  return (
    <table className="table w-full">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={`${index}-${header}`}>{header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product._id}>

            <td>
              {product.name}
            </td>

            <th className="space-x-2">
              <Link
                className="btn btn-xs btn-primary"
                href={`/api/stream-elements/all-purchases?name=${product.name}`}
                target='_blank'
              >
                Baixar Lista
              </Link>
            </th>
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr>
          {headers.map((header, index) => (
            <th key={`${index}-${header}`}>{header}</th>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};
