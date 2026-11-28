import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rentals', '0001_initial'),
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shipplants',
            name='rental_contract',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ship_tasks', to='rentals.rentalcontract', verbose_name='Hợp đồng thuê'),
        ),
        migrations.AddField(
            model_name='shipplants',
            name='purchase_order',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ship_tasks', to='orders.purchaseorder', verbose_name='Đơn mua cây'),
        ),
        migrations.AlterField(
            model_name='shipplants',
            name='ship_type',
            field=models.CharField(choices=[('PURCHASE', 'Giao đơn mua cây'), ('DELIVERY', 'Giao cây thuê ban đầu'), ('RETURN', 'Thu hồi cây hết hạn'), ('REPLACEMENT', 'Giao đổi trả cây')], default='DELIVERY', max_length=20, verbose_name='Loại vận chuyển'),
        ),
        migrations.AlterField(
            model_name='shipplants',
            name='status',
            field=models.CharField(choices=[('PENDING', 'Chưa phân công'), ('ASSIGNED', 'Đã phân công'), ('SHIPPING', 'Đang vận chuyển'), ('DELIVERED_PENDING_CONFIRM', 'Chờ Admin xác nhận (POD)'), ('DELIVERED', 'Giao thành công'), ('CANCELLED', 'Hủy giao')], db_index=True, default='PENDING', max_length=30, verbose_name='Trạng thái giao nhận'),
        ),
        migrations.AlterField(
            model_name='shipplants',
            name='scheduled_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Thời gian dự kiến giao'),
        ),
        migrations.AddField(
            model_name='shipplants',
            name='confirmed_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Thời gian Admin xác nhận hoàn tất'),
        ),
        migrations.AddField(
            model_name='shipplants',
            name='cod_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=14, verbose_name='Số tiền COD cần thu'),
        ),
        migrations.AddField(
            model_name='shipplants',
            name='cod_collected',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=14, verbose_name='Số tiền COD thực tế đã thu'),
        ),
        migrations.AddField(
            model_name='shipplants',
            name='proof_image',
            field=models.TextField(blank=True, default='', verbose_name='Ảnh bằng chứng giao cây (POD)'),
        ),
        migrations.AddField(
            model_name='shipplants',
            name='shipper_notes',
            field=models.TextField(blank=True, default='', verbose_name='Ghi chú từ Shipper'),
        ),
        migrations.AddField(
            model_name='shipplants',
            name='admin_notes',
            field=models.TextField(blank=True, default='', verbose_name='Ghi chú đối soát từ Admin'),
        ),
    ]
