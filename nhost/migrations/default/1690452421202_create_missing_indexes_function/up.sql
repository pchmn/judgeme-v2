create or replace function missing_fk_indexes () 
returns table (
  referencing_table regclass,
  fk_columns        varchar,
  table_size        varchar,
  fk_constraint     name,
  referenced_table  regclass
)
language sql as $$
  select
    -- referencing table having ta foreign key declaration
    tc.conrelid::regclass as referencing_table,
    
    -- ordered list of foreign key columns
    string_agg(ta.attname, ', ' order by tx.n) as fk_columns,
    
    -- referencing table size
    pg_catalog.pg_size_pretty (
      pg_catalog.pg_relation_size(tc.conrelid)
    ) as table_size,
    
    -- name of the foreign key constraint
    tc.conname as fk_constraint,
    
    -- name of the target or destination table
    tc.confrelid::regclass as referenced_table
    
  from pg_catalog.pg_constraint tc
  
  -- enumerated key column numbers per foreign key
  cross join lateral unnest(tc.conkey) with ordinality as tx(attnum, n)
  
  -- name for each key column
  join pg_catalog.pg_attribute ta on ta.attnum = tx.attnum and ta.attrelid = tc.conrelid
  
  where not exists (
    -- is there ta matching index for the constraint?
    select 1 from pg_catalog.pg_index i
    where 
      i.indrelid = tc.conrelid and 
      -- the first index columns must be the same as the key columns, but order doesn't matter
      (i.indkey::smallint[])[0:cardinality(tc.conkey)-1] @> tc.conkey) and 
      tc.contype = 'f'
    group by 
      tc.conrelid, 
      tc.conname, 
      tc.confrelid
    order by 
      pg_catalog.pg_relation_size(tc.conrelid) desc
$$;
